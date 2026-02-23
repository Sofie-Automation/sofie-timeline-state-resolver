import PQueue from 'p-queue'

/**
 * CancellableQueue is a PromiseQueue, but each action has a "CancelGroup" parameter.
 * If a new action is added to the queue with the same "CancelGroup" as a a scheduled action,
 * the scheduled action will be unscheduled.
 *
 * A typical use case for this are idempotent commands, where only the latest command should be executed,
 * and previous ones can be cancelled, as they are now outdated.
 *
 * Note that a function that already has
 */
export class CancellableQueue {
	private _queue = new PQueue({ concurrency: 1 })
	private _scheduledActions: { [cancelGroup: string]: (() => void)[] } = {}
	private _scheduledNoGroupActions: (() => void)[] = []

	constructor() {
		this._queue.on('idle', () => {
			this._scheduledActions = {}
		})
	}

	public async add(cancelGroup: string | null, action: () => Promise<void> | void): Promise<void> {
		let cancelQueue: (() => void)[]
		if (cancelGroup !== null) {
			// If there is already a scheduled action with the same cancel group, cancel it

			cancelQueue = this._scheduledActions[cancelGroup] ?? []
			this._scheduledActions[cancelGroup] = cancelQueue
			if (cancelQueue) {
				cancelQueue.forEach((cancel) => {
					cancel()
				})
				cancelQueue.length = 0
			}
		} else {
			// If there is no cancel group, use the separate no-group queue:
			cancelQueue = this._scheduledNoGroupActions
		}

		// Setup a cancellation function for the new action, and add it to the cancel queue:
		let cancelled = false
		const cancel = () => {
			cancelled = true
		}
		cancelQueue.push(cancel)

		// Add the action to the queue, but check if it has been cancelled before executing
		return this._queue.add(async () => {
			if (cancelled) return
			await Promise.resolve(action())
		})
	}

	/** Clear and cancel any scheduled actions */
	public clear(): void {
		// this._queue.clear()

		for (const cancelGroup of Object.values<(() => void)[]>(this._scheduledActions)) {
			cancelGroup.forEach((cancel) => cancel())
		}
		for (const cancel of this._scheduledNoGroupActions) {
			cancel()
		}
		this._scheduledActions = {}
	}
	/** Returns a promise that resolves after all scheduled actions have finished executing */
	public async waitForQueue(): Promise<void> {
		return this._queue.add(async () => Promise.resolve(), {
			priority: -Infinity, // Ensure this runs after all currently scheduled actions
		})
	}
}
