import { DeviceType, StatusCode } from 'timeline-state-resolver-types'
import { DeviceInstanceWrapper } from '../DeviceInstance'
import { ActionExecutionResultCode } from 'timeline-state-resolver-types'
import { t } from '../../lib'
import { DevicesDict } from '../devices'
import { waitTime } from '../../__tests__/lib'

const StateHandler = {
	terminate: jest.fn(),
	clearFutureStates: jest.fn(),
	handleState: jest.fn(),
	setCurrentState: jest.fn(),
	clearFutureAfterTimestamp: jest.fn(),
}
jest.mock('../stateHandler', () => ({
	StateHandler: class Statehandler {
		terminate = StateHandler.terminate
		clearFutureStates = StateHandler.clearFutureStates
		handleState = jest.fn(async () => {
			// some shenanigans required to get the mock impl to work
			StateHandler.handleState()
			return Promise.resolve()
		})
		setCurrentState = StateHandler.setCurrentState
		clearFutureAfterTimestamp = StateHandler.clearFutureAfterTimestamp
	},
}))

const AbstractDeviceMock = {
	init: jest.fn(),
	terminate: jest.fn(),
	action: jest.fn(),
	convertTimelineStateToDeviceState: jest.fn(),
	getStatus: jest.fn(),
	diffStates: jest.fn(),
	sendCommand: jest.fn(),
	on: jest.fn(),
}
jest.mock('../../integrations/abstract/index', () => ({
	AbstractDevice: class AbstractDevice {
		actions = {
			action: AbstractDeviceMock.action,
		}
		init = AbstractDeviceMock.init
		terminate = AbstractDeviceMock.terminate
		convertTimelineStateToDeviceState = AbstractDeviceMock.convertTimelineStateToDeviceState
		getStatus = () => {
			AbstractDeviceMock.getStatus()
			return { statusCode: StatusCode.GOOD, messages: [] }
		}
		diffStates = AbstractDeviceMock.diffStates
		sendCommand = AbstractDeviceMock.sendCommand
		on = AbstractDeviceMock.on
	},
}))
const AtemDeviceMock = {
	init: jest.fn(),
	terminate: jest.fn(),
	action: jest.fn(),
	convertTimelineStateToDeviceState: jest.fn(),
	getStatus: jest.fn(),
	diffStates: jest.fn(),
	sendCommand: jest.fn(),
	on: jest.fn(),
	applyAddressState: jest.fn(),
	diffAddressStates: jest.fn(),
	addressStateReassertsControl: jest.fn(),
}
jest.mock('../../integrations/atem/index', () => ({
	AtemDevice: class AtemDevice {
		actions = {
			action: AtemDeviceMock.action,
		}
		init = AtemDeviceMock.init
		terminate = AtemDeviceMock.terminate
		convertTimelineStateToDeviceState = AtemDeviceMock.convertTimelineStateToDeviceState
		getStatus = () => {
			AtemDeviceMock.getStatus()
			return { statusCode: StatusCode.GOOD, messages: [] }
		}
		diffStates = AtemDeviceMock.diffStates
		sendCommand = AtemDeviceMock.sendCommand
		on = AtemDeviceMock.on
		applyAddressState = AtemDeviceMock.applyAddressState
		diffAddressStates = AtemDeviceMock.diffAddressStates
		addressStateReassertsControl = AtemDeviceMock.addressStateReassertsControl
	},
}))
// jest.mock('../StateTracker', () => ({ StateTracker: jest.fn().mockImplementation(() => ({})) }))

function getDeviceInstance(getTime = async () => Date.now()): DeviceInstanceWrapper {
	return new DeviceInstanceWrapper('wrapper0', Date.now(), null, { type: DeviceType.ABSTRACT }, getTime)
}
function getDeviceInstanceWithTracker(getTime = async () => Date.now(), disable = false): DeviceInstanceWrapper {
	return new DeviceInstanceWrapper(
		'wrapper0',
		Date.now(),
		{ type: DeviceType.ATEM, disableSharedHardwareControl: disable },
		getTime
	)
}

describe('DeviceInstance', () => {
	afterEach(() => {
		jest.resetAllMocks()
	})

	test('constructor', () => {
		const dev = getDeviceInstance()
		expect(dev).toBeTruthy()

		// @ts-expect-error
		expect(dev._stateHandler).toBeTruthy()
		// @ts-expect-error
		expect(dev._device).toBeTruthy()
		// @ts-expect-error
		expect(dev._stateTracker).toBeUndefined()
	})

	test('initDevice', async () => {
		const dev = getDeviceInstance()
		await dev.initDevice()
		expect(AbstractDeviceMock.init).toHaveBeenCalled()
	})

	test('terminate', async () => {
		const dev = getDeviceInstance()
		await dev.terminate()

		expect(StateHandler.terminate).toHaveBeenCalled()
		expect(AbstractDeviceMock.terminate).toHaveBeenCalled()
	})

	describe('executeAction', () => {
		test('execute action', async () => {
			const dev = getDeviceInstance()
			await dev.executeAction('action', { payload: 1 })

			expect(AbstractDeviceMock.action).toHaveBeenCalledWith({ payload: 1 })
		})

		test('unknown id', async () => {
			const dev = getDeviceInstance()
			const result = await dev.executeAction('doesnt exist', { payload: 1 })

			expect(AbstractDeviceMock.action).not.toHaveBeenCalled()
			expect(result).toEqual({
				result: ActionExecutionResultCode.Error,
				response: t('Action "{{id}}" not found', { id: 'doesnt exist' }),
			})
		})
	})

	test('handleState', () => {
		const dev = getDeviceInstance()
		dev.handleState({ time: 100, layers: {}, nextEvents: [] }, {})

		expect(StateHandler.handleState).toHaveBeenCalled()
	})

	test('clearFuture', () => {
		const dev = getDeviceInstance()
		dev.clearFuture(1)

		expect(StateHandler.clearFutureAfterTimestamp).toHaveBeenCalledWith(1)
	})

	test('getDetails', () => {
		const dev = getDeviceInstance()
		const details = dev.getDetails()

		expect(details).toEqual({
			deviceId: 'wrapper0',
			deviceType: DeviceType.ABSTRACT,
			deviceName: DevicesDict[DeviceType.ABSTRACT].deviceName('wrapper0', {}),
			instanceId: expect.any(Number),
			startTime: expect.any(Number),

			supportsExpectedPlayoutItems: false,
			canConnect: DevicesDict[DeviceType.ABSTRACT].canConnect,
		})
	})

	test('getStatus', () => {
		const dev = getDeviceInstance()
		const status = dev.getStatus()

		expect(AbstractDeviceMock.getStatus).toHaveBeenCalled()
		expect(status).toEqual({
			statusCode: StatusCode.GOOD,
			messages: [],
			active: false, // because it has no mappings
		})

		dev.handleState(
			{ time: 1, layers: {}, nextEvents: [] },
			{ test: { device: DeviceType.ABSTRACT, deviceId: 'wrapper0', options: {} } }
		)
		const status2 = dev.getStatus()

		expect(AbstractDeviceMock.getStatus).toHaveBeenCalledTimes(2)
		expect(status2).toEqual({
			statusCode: StatusCode.GOOD,
			messages: [],
			active: true, // because it has mappings now
		})
	})

	test('getCurrentTime', async () => {
		const TIME_DIFF = -100
		const getRemoteTime = jest.fn(async () => Date.now() + TIME_DIFF)
		const dev = getDeviceInstance(getRemoteTime) // simulate 10ms ipc delay

		{
			// wait for the first sync to happen
			await waitTime(10)
			expect(getRemoteTime).toHaveBeenCalledTimes(1)

			const t = dev.getCurrentTime()
			const expectedTime = Date.now() + TIME_DIFF

			// it may be a bit delayed
			expect(t).toBeGreaterThanOrEqual(expectedTime - 10)
			// it should never be faster
			expect(t).toBeLessThanOrEqual(expectedTime + 10)
		}
		{
			// check that this still works after a bit of delay
			await waitTime(250)
			expect(getRemoteTime).toHaveBeenCalledTimes(1)

			const t = dev.getCurrentTime()
			const expectedTime = Date.now() + TIME_DIFF

			expect(t).toBeGreaterThanOrEqual(expectedTime - 10)
			expect(t).toBeLessThanOrEqual(expectedTime + 10)
		}
	})

	test('init device with shared hardware control', async () => {
		const dev = getDeviceInstanceWithTracker()
		// @ts-expect-error
		expect(dev._stateTracker).toBeTruthy()
	})
	test('init device with explicitly disabled shared hardware control', async () => {
		const dev = getDeviceInstanceWithTracker(undefined, true)
		// @ts-expect-error
		expect(dev._stateTracker).toBeUndefined()
	})

	// todo - test event handlers
})
