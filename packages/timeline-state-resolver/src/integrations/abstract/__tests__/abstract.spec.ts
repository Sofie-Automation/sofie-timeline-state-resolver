/* eslint-disable jest/expect-expect */
import { TSRTimelineContent, TimelineContentAbstractAny, DeviceType, StatusCode } from 'timeline-state-resolver-types'
import { AbstractCommandWithContext, AbstractDevice, AbstractDeviceState } from '..'
import { MockTime } from '../../../__tests__/mockTime'
import { makeDeviceTimelineStateObject } from '../../../__mocks__/objects'
import { getDeviceContext } from '../../__tests__/testlib'
import { DeviceTimelineState, DeviceTimelineStateObject } from 'timeline-state-resolver-api'

async function getInitialisedDevice() {
	const dev = new AbstractDevice(getDeviceContext())
	await dev.init({})

	return dev
}

describe('Abstract device', () => {
	const mockTime = new MockTime()
	beforeEach(() => {
		mockTime.init()
	})

	test('Device setup', async () => {
		const device = await getInitialisedDevice()

		expect(device.connected).toBeFalsy()
		expect(device.getStatus()).toMatchObject({ statusCode: StatusCode.GOOD })
	})

	test('convertTimelineStateToDeviceState', async () => {
		const device = await getInitialisedDevice()

		const testState: DeviceTimelineState<TSRTimelineContent> = {
			time: 10,
			objects: [],
		}
		const resultState = device.convertTimelineStateToDeviceState(testState)
		expect(resultState).toBeTruthy()
		expect(resultState).toEqual({} as AbstractDeviceState)
	})

	describe('diffState', () => {
		const LAYERNAME = 'myLayer0'

		async function compareStates(
			oldDevState: AbstractDeviceState | undefined,
			newDevState: AbstractDeviceState,
			expCommands: AbstractCommandWithContext[]
		) {
			const device = await getInitialisedDevice()

			const commands = device.diffStates(oldDevState, newDevState)

			expect(commands).toEqual(expCommands)
		}

		test('From undefined', async () => {
			await compareStates(
				undefined,
				{
					// empty
				},
				[]
			)
		})

		test('Empty states', async () => {
			await compareStates(
				{
					// empty
				},
				{
					// empty
				},
				[]
			)
		})

		test('Start object', async () => {
			await compareStates(
				{
					// empty
				},
				{
					[LAYERNAME]: createDeviceTimelineStateObject('obj0', LAYERNAME),
				},
				[
					{
						command: 'addedAbstract',
						context: 'added: obj0',
						timelineObjId: 'obj0',
					},
				]
			)
		})

		test('Change object', async () => {
			await compareStates(
				{
					[LAYERNAME]: createDeviceTimelineStateObject('obj0', LAYERNAME),
				},
				{
					[LAYERNAME]: createDeviceTimelineStateObject('obj1', LAYERNAME),
				},
				[
					{
						command: 'changedAbstract',
						context: 'changed: obj1',
						timelineObjId: 'obj1',
					},
				]
			)
		})

		test('End object', async () => {
			await compareStates(
				{
					[LAYERNAME]: createDeviceTimelineStateObject('obj0', LAYERNAME),
				},
				{
					// empty
				},
				[
					{
						command: 'removedAbstract',
						context: 'removed: obj0',
						timelineObjId: 'obj0',
					},
				]
			)
		})
	})
})

function createDeviceTimelineStateObject(
	objectId: string,
	layerName: string
): DeviceTimelineStateObject<TimelineContentAbstractAny> {
	return makeDeviceTimelineStateObject({
		id: objectId,
		enable: {
			start: 0,
		},
		layer: layerName,
		content: {
			deviceType: DeviceType.ABSTRACT,
		},
	})
}
