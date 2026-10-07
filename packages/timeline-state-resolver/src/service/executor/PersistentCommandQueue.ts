/**
 * Holds per-queue promise chains that persist across state-change batches.
 * Commands with the same queueId will always be executed one after another,
 * even when they originate from different (consecutive) timeline states.
 *
 * Create one instance per device and pass it to CommandExecutor when using
 * the 'sequential-persistent' execution mode.
 */
export class PersistentCommandQueue {
	private queues = new Map<string, Promise<void>>()

	/**
	 * Enqueues a task onto the queue identified by queueId.
	 * Returns a promise that resolves when the task has completed.
	 */
	async enqueue(queueId: string, task: () => Promise<void>): Promise<void> {
		const previous = this.queues.get(queueId) ?? Promise.resolve()
		const next = previous.then(task, task) // always advance even on failure
		this.queues.set(queueId, next)
		return next
	}
}
