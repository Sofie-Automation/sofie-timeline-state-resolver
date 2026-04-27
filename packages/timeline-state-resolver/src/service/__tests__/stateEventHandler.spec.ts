import { DeviceType } from 'timeline-state-resolver-types'
import { StateEventHandler } from '../stateEventHandler.js'
import type { SomeTSRStateEvent } from '../../index.js'

const DEVICE_ID = 'device0'
const DEVICE_TYPE = DeviceType.ABSTRACT

function makeHandler(onFlush = jest.fn()): { handler: StateEventHandler; onFlush: jest.Mock } {
	return { handler: new StateEventHandler(DEVICE_ID, DEVICE_TYPE, onFlush), onFlush }
}

describe('StateEventHandler', () => {
	beforeEach(() => {
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	describe('filtering', () => {
		test('does not emit when allowlist is empty (default)', () => {
			const { handler, onFlush } = makeHandler()

			handler.report('some.event', { value: 1 })
			jest.runAllTimers()

			expect(onFlush).not.toHaveBeenCalled()
		})

		test('emits only subscribed event names', () => {
			const { handler, onFlush } = makeHandler()
			handler.setEventSubscriptions(['a.event'])

			handler.report('a.event', { x: 1 })
			handler.report('b.event', { x: 2 })
			jest.runAllTimers()

			expect(onFlush).toHaveBeenCalledTimes(1)
			const [events] = onFlush.mock.calls[0] as [SomeTSRStateEvent[]]
			expect(events).toHaveLength(1)
			expect(events[0].event).toBe('a.event')
		})

		test('emits nothing after subscriptions cleared to empty', () => {
			const { handler, onFlush } = makeHandler()
			handler.setEventSubscriptions(['a.event'])
			handler.setEventSubscriptions([])

			handler.report('a.event', { x: 1 })
			jest.runAllTimers()

			expect(onFlush).not.toHaveBeenCalled()
		})

		test('respects updated subscriptions for subsequent reports', () => {
			const { handler, onFlush } = makeHandler()
			handler.setEventSubscriptions(['a.event'])

			handler.report('a.event', { x: 1 })
			jest.runAllTimers()
			onFlush.mockClear()

			handler.setEventSubscriptions(['b.event'])
			handler.report('a.event', { x: 2 }) // no longer subscribed
			handler.report('b.event', { x: 3 }) // now subscribed
			jest.runAllTimers()

			expect(onFlush).toHaveBeenCalledTimes(1)
			const [events] = onFlush.mock.calls[0] as [SomeTSRStateEvent[]]
			expect(events).toHaveLength(1)
			expect(events[0].event).toBe('b.event')
		})
	})

	describe('batching', () => {
		test('multiple reports in the same tick are batched into one flush', () => {
			const { handler, onFlush } = makeHandler()
			handler.setEventSubscriptions(['a.event', 'b.event'])

			handler.report('a.event', { x: 1 })
			handler.report('b.event', { x: 2 })
			handler.report('a.event', { x: 3 })

			expect(onFlush).not.toHaveBeenCalled() // not yet

			jest.runAllTimers()

			expect(onFlush).toHaveBeenCalledTimes(1)
			const [events] = onFlush.mock.calls[0] as [SomeTSRStateEvent[]]
			expect(events).toHaveLength(3)
		})

		test('reports across separate ticks produce separate flushes', () => {
			const { handler, onFlush } = makeHandler()
			handler.setEventSubscriptions(['a.event'])

			handler.report('a.event', { tick: 1 })
			jest.runAllTimers()

			handler.report('a.event', { tick: 2 })
			jest.runAllTimers()

			expect(onFlush).toHaveBeenCalledTimes(2)
		})

		test('calls onFlush for events queued before subscriptions cleared', () => {
			// The pending snapshot is taken at flush time, not at report time.
			// An event queued while 'a.event' was subscribed must still be flushed
			// even if subscriptions are cleared before the flush fires.
			const { handler, onFlush } = makeHandler()
			handler.setEventSubscriptions(['a.event'])

			// Queue an event that passes the current subscription filter
			handler.report('a.event', { x: 1 })
			// Clearing subscriptions after report does not remove already-queued events
			handler.setEventSubscriptions([]) // won't affect already-queued events

			jest.runAllTimers()

			// The event was queued before subscriptions were cleared,
			// so it IS flushed — the pending snapshot is taken at flush time
			expect(onFlush).toHaveBeenCalledTimes(1)
		})
	})

	describe('event shape', () => {
		test('emitted events carry correct deviceId, deviceType, event name and payload', () => {
			const { handler, onFlush } = makeHandler()
			handler.setEventSubscriptions(['me.1.inputs'])

			const payload = { programInput: 5, previewInput: 2 }
			handler.report('me.1.inputs', payload)
			jest.runAllTimers()

			const [events] = onFlush.mock.calls[0] as [SomeTSRStateEvent[]]
			expect(events[0]).toMatchObject({
				deviceId: DEVICE_ID,
				deviceType: DEVICE_TYPE,
				event: 'me.1.inputs',
				payload,
			})
		})

		test('multiple events in a batch each carry the correct device identity', () => {
			const { handler, onFlush } = makeHandler()
			handler.setEventSubscriptions(['a', 'b'])

			handler.report('a', 1)
			handler.report('b', 2)
			jest.runAllTimers()

			const [events] = onFlush.mock.calls[0] as [SomeTSRStateEvent[]]
			for (const ev of events) {
				expect(ev.deviceId).toBe(DEVICE_ID)
				expect(ev.deviceType).toBe(DEVICE_TYPE)
			}
		})
	})
})
