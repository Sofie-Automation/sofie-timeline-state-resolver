import { Timeline, TSRTimelineContent } from 'timeline-state-resolver-types'
import { StateHandler } from '../stateHandler'
import { MockTime } from '../../__tests__/mockTime'

interface DeviceState {
	[prop: string]: {
		value: boolean
		preliminary?: number
	}
}
interface CommandWithContext {
	command: {
		type: 'added' | 'removed'
		property: string
	}
	context: string
	timelineObjId: string
}

const MOCK_COMMAND_RECEIVER = jest.fn()

const CONTEXT = {
	deviceId: 'unitTests0',
	logger: {
		debug: console.log,
		info: console.log,
		warn: console.log,
		error: console.log,
	},
	emitTimeTrace: () => null,
	reportStateChangeMeasurement: () => null,
	getCurrentTime: () => Date.now(),
}

const diff = jest.fn()
const StateTrackerMock = {
	addresses: ['entry1'],
	deviceAhead: true,
	expState: { value: true },

	isDeviceAhead: jest.fn(() => StateTrackerMock.deviceAhead),
	updateExpectedState: jest.fn(),
	getExpectedState: jest.fn(() => StateTrackerMock.expState),
	unsetExpectedState: jest.fn(),
	updateState: jest.fn(),
	getCurrentState: jest.fn(() => ({})),
	getAllAddresses: jest.fn(() => {
		return StateTrackerMock.addresses
	}),
	clearState: jest.fn(),

	reset() {
		this.addresses = ['entry1']
		this.deviceAhead = true
		this.expState = { value: true }

		this.isDeviceAhead = jest.fn(() => StateTrackerMock.deviceAhead)
		this.updateExpectedState = jest.fn()
		this.getExpectedState = jest.fn(() => StateTrackerMock.expState)
		this.unsetExpectedState = jest.fn()
		this.updateState = jest.fn()
		this.getCurrentState = jest.fn(() => ({}))
		this.getAllAddresses = jest.fn(() => {
			return StateTrackerMock.addresses
		})
		this.clearState = jest.fn()
	},
}
jest.mock('../stateTracker', () => ({
	StateTracker: class StateTracker {
		isDeviceAhead = StateTrackerMock.isDeviceAhead
		updateExpectedState = StateTrackerMock.updateExpectedState
		getExpectedState = StateTrackerMock.getExpectedState
		unsetExpectedState = StateTrackerMock.unsetExpectedState
		updateState = StateTrackerMock.updateState
		getCurrentState = StateTrackerMock.getCurrentState
		getAllAddresses = StateTrackerMock.getAllAddresses
		clearState = StateTrackerMock.clearState
	},
}))
const deviceTrackerMethodsImpl = {
	reassertsControl: true,

	applyAddressState: jest.fn((state, addr, addrState) => {
		state[addr] = addrState
	}),
	diffAddressStates: jest.fn((a, b) => {
		return a?.value !== b?.value
	}),
	addressStateReassertsControl: jest.fn(() => deviceTrackerMethodsImpl.reassertsControl),
}
import { StateTracker } from '../stateTracker'

describe('stateHandler', () => {
	const mockTime = new MockTime()
	beforeEach(() => {
		mockTime.init()
		// jest.useFakeTimers({ now: 10000 })
		MOCK_COMMAND_RECEIVER.mockReset()

		StateTrackerMock.reset()
		deviceTrackerMethodsImpl.reassertsControl = true
	})

	function getNewStateHandler(withStateHandler = false): StateHandler<DeviceState, CommandWithContext> {
		const trackerMethods = withStateHandler ? deviceTrackerMethodsImpl : {}

		return new StateHandler<DeviceState, CommandWithContext>(
			CONTEXT,
			{
				executionType: 'salvo',
			},
			{
				convertTimelineStateToDeviceState: (s) => {
					const stateObj = s.objects.reduce((acc, obj) => {
						acc[obj.layer] = obj.content
						return acc
					}, {} as any)

					return withStateHandler
						? { deviceState: stateObj as DeviceState, addressStates: stateObj }
						: (stateObj as DeviceState)
				},
				diffStates: (o, n) => {
					return [
						...Object.keys(n)
							.filter((e) => !(o || {})[e])
							.map((e) => ({
								command: {
									type: 'added',
									property: e,
								},
								preliminary: n[e].preliminary,
							})),
						...Object.keys(o || {})
							.map((e) =>
								!n[e]
									? {
											command: {
												type: 'removed',
												property: e,
											},
									  }
									: n[e].value !== o?.[e]?.value
									? {
											command: {
												type: 'changed',
												property: e,
											},
									  }
									: null
							)
							.filter((c) => c !== null),
					] as CommandWithContext[]
				},
				sendCommand: MOCK_COMMAND_RECEIVER,
				...trackerMethods,
			},
			withStateHandler ? new StateTracker(diff, true) : undefined
		)
	}

	async function getNewStateHandlerWithStates(stateToHandle: Timeline.TimelineState<TSRTimelineContent>) {
		const stateHandler = getNewStateHandler(true)
		stateHandler.setCurrentState({
			entry1: { value: true },
		})
		stateHandler.handleState(stateToHandle, {})

		return stateHandler
	}

	test('transition to a new state', async () => {
		const stateHandler = getNewStateHandler()

		stateHandler.setCurrentState({
			entry1: { value: true },
		})

		stateHandler.handleState(createTimelineState(10000, {}), {})

		await mockTime.tick()

		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledWith({
			command: {
				type: 'removed',
				property: 'entry1',
			},
		})
	})

	test('transition to 2 new states', async () => {
		const stateHandler = getNewStateHandler()

		stateHandler.setCurrentState({
			entry1: { value: true },
		})

		stateHandler.handleState(createTimelineState(10000, {}), {})

		await mockTime.tick()

		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledWith({
			command: {
				type: 'removed',
				property: 'entry1',
			},
		})

		stateHandler.handleState(
			createTimelineState(10100, {
				entry1: { value: true },
			}),
			{}
		)

		await mockTime.tick()

		// do not expect to be called because this is in the future
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)

		// advance time
		MOCK_COMMAND_RECEIVER.mockReset()
		await mockTime.advanceTimeTicks(100)

		// now expect to be called with new commands
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledWith({
			command: {
				type: 'added',
				property: 'entry1',
			},
		})
	})

	test('transition to a new state with preliminary commands', async () => {
		const stateHandler = getNewStateHandler()

		stateHandler.setCurrentState({})

		stateHandler.handleState(
			createTimelineState(12000, {
				entry1: {
					value: true,
					preliminary: 300,
				},
				entry2: {
					value: true,
				},
			}),
			{}
		)

		await mockTime.tick()

		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(0)

		await mockTime.advanceTimeTicks(1700)

		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenNthCalledWith(1, {
			command: {
				type: 'added',
				property: 'entry1',
			},
			preliminary: 300,
		})

		await mockTime.advanceTimeTicks(300)

		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(2)
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenNthCalledWith(2, {
			command: {
				type: 'added',
				property: 'entry2',
			},
		})
	})

	test('ignore transitions to states older than current state', async () => {
		const stateHandler = getNewStateHandler()
		stateHandler.setCurrentState({
			entry1: { value: true },
		})

		stateHandler.handleState(createTimelineState(10000, {}), {})

		await mockTime.tick()

		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledWith({
			command: {
				type: 'removed',
				property: 'entry1',
			},
		})

		stateHandler.handleState(
			createTimelineState(10100, {
				entry1: { value: true },
			}),
			{}
		)

		await mockTime.tick()
		// do not expect to be called because this is in the future
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)

		// advance time
		MOCK_COMMAND_RECEIVER.mockReset()
		await mockTime.advanceTimeTicks(100)

		// now expect to be called with new commands
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledWith({
			command: {
				type: 'added',
				property: 'entry1',
			},
		})

		//
		MOCK_COMMAND_RECEIVER.mockReset()

		stateHandler.handleState(createTimelineState(10000, {}), {})

		await mockTime.tick()

		// do not expect to be called because new state is in the past
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(0)

		await mockTime.advanceTimeTicks(100)

		// still no new commands to be received
		expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(0)
	})

	describe('tracker behaviour', () => {
		test('Reassert control', async () => {
			// deviceTrackerMethodsImpl.reassertsControl is "true" by default

			await getNewStateHandlerWithStates(
				createTimelineState(10000, {
					entry1: { value: true },
				})
			)
			await mockTime.tick()

			// device is ahead but our integration reasserts control anyway
			expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)
			expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledWith({
				command: {
					type: 'changed',
					property: 'entry1',
				},
			})

			expect(StateTrackerMock.getAllAddresses).toHaveBeenCalled()
			expect(StateTrackerMock.isDeviceAhead).toHaveBeenCalled()
			expect(StateTrackerMock.getCurrentState).toHaveBeenCalled()
			expect(StateTrackerMock.getExpectedState).toHaveBeenCalled()
			expect(StateTrackerMock.updateExpectedState).toHaveBeenCalled()
		})

		test('Device is ahead, existing timeline ignored', async () => {
			deviceTrackerMethodsImpl.reassertsControl = false

			await getNewStateHandlerWithStates(
				createTimelineState(10000, {
					entry1: { value: true },
				})
			)
			await mockTime.tick()

			// device is ahead so no commands should be sent
			expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(0)
		})

		test('Timeline reasserts control', async () => {
			deviceTrackerMethodsImpl.reassertsControl = false // we don't explicitly take control back

			await getNewStateHandlerWithStates(
				createTimelineState(10000, {
					entry1: { value: false }, // this value changes from true to false, so tsr wants to take control again
				})
			)
			await mockTime.tick()

			// device is ahead but tsr reasserts
			expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)
			expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledWith({
				command: {
					type: 'changed',
					property: 'entry1',
				},
			})

			expect(StateTrackerMock.updateExpectedState).toHaveBeenCalledTimes(1)
			expect(StateTrackerMock.updateExpectedState).toHaveBeenCalledWith('entry1', { value: false }, true)
		})

		test('Timeline goes to undefined when device is ahead', async () => {
			deviceTrackerMethodsImpl.reassertsControl = false // we don't explicitly take control back

			await getNewStateHandlerWithStates(createTimelineState(10000, {}))
			await mockTime.tick()

			// we get no commands here as the device is ahead
			expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(0)

			// entry1 is removed from the expected states
			expect(StateTrackerMock.unsetExpectedState).toHaveBeenCalledWith('entry1')
		})

		test('Timeline goes to undefined when device is under control', async () => {
			deviceTrackerMethodsImpl.reassertsControl = false // we don't explicitly take control back
			StateTrackerMock.deviceAhead = false

			await getNewStateHandlerWithStates(createTimelineState(10000, {}))
			await mockTime.tick()

			// device is updated
			expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledTimes(1)
			expect(MOCK_COMMAND_RECEIVER).toHaveBeenCalledWith({
				command: {
					type: 'removed',
					property: 'entry1',
				},
			})

			// entry1 is removed from the expected states
			expect(StateTrackerMock.unsetExpectedState).toHaveBeenCalledWith('entry1')
		})
	})
})

function createTimelineState(
	time: number,
	objs: Record<string, { value: boolean; preliminary?: number }>
): Timeline.TimelineState<TSRTimelineContent> {
	return {
		time,
		layers: Object.fromEntries(
			Object.entries<any>(objs).map(([id, obj]) => [
				id,
				{
					layer: id,
					content: obj,
				},
			])
		) as any,
		nextEvents: [],
	}
}
