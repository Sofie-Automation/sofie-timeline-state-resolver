import type { DeviceTypeExt, SomeTSRStateEvent } from '../index.js'

/**
 * Manages filtering and batched emission of state events for a single device.
 *
 * Events are only emitted when their name appears in the active subscription set.
 * Pending events are accumulated and flushed together in a single `setImmediate` tick.
 */
export class StateEventHandler {
	readonly #deviceId: string
	readonly #deviceType: DeviceTypeExt
	readonly #onFlush: (events: SomeTSRStateEvent[]) => void

	#allowedEvents: Set<string> = new Set()
	#pendingEvents: SomeTSRStateEvent[] = []
	#flushScheduled = false

	constructor(deviceId: string, deviceType: DeviceTypeExt, onFlush: (events: SomeTSRStateEvent[]) => void) {
		this.#deviceId = deviceId
		this.#deviceType = deviceType
		this.#onFlush = onFlush
	}

	setEventSubscriptions(events: string[]): void {
		this.#allowedEvents = new Set(events)
	}

	report(eventName: string, payload: unknown): void {
		if (!this.#allowedEvents.has(eventName)) return

		this.#pendingEvents.push({
			deviceId: this.#deviceId,
			deviceType: this.#deviceType,
			event: eventName,
			payload,
		} as SomeTSRStateEvent)

		if (!this.#flushScheduled) {
			this.#flushScheduled = true
			setImmediate(() => {
				this.#flushScheduled = false
				const events = this.#pendingEvents.splice(0)
				if (events.length > 0) this.#onFlush(events)
			})
		}
	}
}
