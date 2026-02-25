import {
	Mappings,
	DeviceType,
	Mapping,
	SomeMappingSisyfos,
	TimelineContentTypeSisyfos,
	MappingSisyfosType,
	TSRTimelineContent,
	TimelineContentSisyfosAny,
	Timeline,
} from 'timeline-state-resolver-types'
import * as OSC from '../../../__mocks__/osc.js'
const MockOSC = OSC.MockOSC
import { MockTime } from '../../../__tests__/mockTime.js'
import { SisyfosMessageDevice } from '../../../integrations/sisyfos/index.js'
import { waitUntil } from '../../../__tests__/lib.js'
import { SisyfosCommandType, SisyfosState } from '../connection.js'
import { getDeviceContext } from '../../__tests__/testlib.js'
import { DeviceContextAPI, DeviceTimelineState, DeviceTimelineStateObject } from 'timeline-state-resolver-api'

describe('Sisyfos', () => {
	jest.mock('osc', () => OSC)
	const mockTime = new MockTime()

	const orgSetTimeout = setTimeout

	async function wait(time = 1) {
		return new Promise((resolve) => {
			orgSetTimeout(resolve, time)
		})
	}

	beforeEach(() => {
		mockTime.init()
	})

	test('Sisyfos: set ch1: pgm & ch2: lookahead and then ch1: vo, ch2: pgm (old api)', async () => {
		const myChannelMapping0: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 0,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping1: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping2: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping3: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			// @ts-expect-error skipping .mappingType to test backwards compatibility
			options: {
				channel: 3,
			},
		}
		const mappings: Mappings = {
			sisyfos_channel_1: myChannelMapping0,
			sisyfos_channel_2: myChannelMapping1,
			sisyfos_channel_2_lookahead: myChannelMapping2,
			sisyfos_channel_3: myChannelMapping3,
		}

		const device = getSisyfosDevice()

		const state0 = createTimelineState({})
		const state1 = createTimelineState({
			sisyfos_channel_1: {
				id: 'obj0',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: 'sisyfos' as any, // backwards-compatibility
					isPgm: 1,
				},
			},
		})
		const sisyfosState0 = device.convertTimelineStateToDeviceState(state0, mappings)
		const sisyfosState1 = device.convertTimelineStateToDeviceState(state1, mappings)
		const commands1 = device.diffStates(sisyfosState0, sisyfosState1)
		expect(commands1).toHaveLength(1)
		expect(commands1[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 0,
			values: [1],
		})

		const obj1 = {
			id: 'obj1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNEL,

				isPgm: 2,
			} satisfies TimelineContentSisyfosAny,
		}
		const state2 = createTimelineState({
			sisyfos_channel_1: obj1,
			sisyfos_channel_2_lookahead: {
				id: 'obj2',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					isPgm: 1,
				},
				isLookahead: true,
				lookaheadForLayer: 'sisyfos_channel_2',
			},
		})
		const sisyfosState2 = device.convertTimelineStateToDeviceState(state2, mappings)
		const commands2 = device.diffStates(sisyfosState1, sisyfosState2)
		expect(commands2).toHaveLength(2)
		expect(commands2[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 0,
			values: [2],
		})
		expect(commands2[1].command).toMatchObject({
			type: 'togglePst',
			channel: 1,
			value: 1,
		})

		const state3 = createTimelineState({
			sisyfos_channel_1: obj1,
			sisyfos_channel_2: {
				id: 'obj3',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					isPgm: 1,
				},
			},
		})
		const sisyfosState3 = device.convertTimelineStateToDeviceState(state3, mappings)
		const commands3 = device.diffStates(sisyfosState2, sisyfosState3)
		expect(commands3).toHaveLength(2)
		expect(commands3[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 1,
			values: [1],
		})
		expect(commands3[1].command).toMatchObject({
			type: 'togglePst',
			channel: 1,
			value: 0,
		})

		const state4 = createTimelineState({
			sisyfos_channel_1: {
				id: 'obj5',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					label: 'MY TIME',
				},
			},
		})
		const sisyfosState4 = device.convertTimelineStateToDeviceState(state4, mappings)
		const commands4 = device.diffStates(sisyfosState3, sisyfosState4)
		expect(commands4).toHaveLength(3)
		expect(commands4[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 0,
			values: [0],
		})
		expect(commands4[1].command).toMatchObject({
			type: 'label',
			channel: 0,
			value: 'MY TIME',
		})
		expect(commands4[2].command).toMatchObject({
			type: 'togglePgm',
			channel: 1,
			values: [0],
		})

		const state5 = createTimelineState({
			sisyfos_channel_1: {
				id: 'obj5',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					visible: false,
				},
			},
		})
		const sisyfosState5 = device.convertTimelineStateToDeviceState(state5, mappings)
		const commands5 = device.diffStates(sisyfosState4, sisyfosState5)
		expect(commands5).toHaveLength(1)
		expect(commands5[0].command).toMatchObject({
			type: 'visible',
			channel: 0,
			value: false,
		})
	})

	test('Sisyfos: set ch1: pgm & ch2: lookahead and then ch1: vo, ch2: pgm', async () => {
		const myChannelMapping0: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 0,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping1: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping2: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping3: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 3,
				setLabelToLayerName: false,
			},
		}
		const mappings: Mappings = {
			sisyfos_channel_1: myChannelMapping0,
			sisyfos_channel_2: myChannelMapping1,
			sisyfos_channel_2_lookahead: myChannelMapping2,
			sisyfos_channel_3: myChannelMapping3,
		}

		const device = getSisyfosDevice()

		const state0 = createTimelineState({})
		const state1 = createTimelineState({
			sisyfos_channel_1: {
				id: 'obj0',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					isPgm: 1,
				},
			},
		})
		const sisyfosState0 = device.convertTimelineStateToDeviceState(state0, mappings)
		const sisyfosState1 = device.convertTimelineStateToDeviceState(state1, mappings)
		const commands1 = device.diffStates(sisyfosState0, sisyfosState1)
		expect(commands1).toHaveLength(1)
		expect(commands1[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 0,
			values: [1],
		})

		const obj1 = {
			id: 'obj1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNEL,

				isPgm: 2,
			} satisfies TimelineContentSisyfosAny,
		}
		const state2 = createTimelineState({
			sisyfos_channel_1: obj1,
			sisyfos_channel_2_lookahead: {
				id: 'obj2',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					isPgm: 1,
				},
				isLookahead: true,
				lookaheadForLayer: 'sisyfos_channel_2',
			},
		})
		const sisyfosState2 = device.convertTimelineStateToDeviceState(state2, mappings)
		const commands2 = device.diffStates(sisyfosState1, sisyfosState2)
		expect(commands2).toHaveLength(2)
		expect(commands2[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 0,
			values: [2],
		})
		expect(commands2[1].command).toMatchObject({
			type: 'togglePst',
			channel: 1,
			value: 1,
		})

		const state3 = createTimelineState({
			sisyfos_channel_1: obj1,
			sisyfos_channel_2: {
				id: 'obj3',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					isPgm: 1,
				},
			},
		})
		const sisyfosState3 = device.convertTimelineStateToDeviceState(state3, mappings)
		const commands3 = device.diffStates(sisyfosState2, sisyfosState3)
		expect(commands3).toHaveLength(2)
		expect(commands3[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 1,
			values: [1],
		})
		expect(commands3[1].command).toMatchObject({
			type: 'togglePst',
			channel: 1,
			value: 0,
		})

		const state4 = createTimelineState({
			sisyfos_channel_1: {
				id: 'obj5',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					label: 'MY TIME',
				},
			},
		})
		const sisyfosState4 = device.convertTimelineStateToDeviceState(state4, mappings)
		const commands4 = device.diffStates(sisyfosState3, sisyfosState4)
		expect(commands4).toHaveLength(3)
		expect(commands4[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 0,
			values: [0],
		})
		expect(commands4[1].command).toMatchObject({
			type: 'label',
			channel: 0,
			value: 'MY TIME',
		})

		const state5 = createTimelineState({
			sisyfos_channel_1: {
				id: 'obj6',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,
					visible: false,
				},
			},
		})
		const sisyfosState5 = device.convertTimelineStateToDeviceState(state5, mappings)
		const commands5 = device.diffStates(sisyfosState4, sisyfosState5)
		expect(commands5).toHaveLength(1)
		expect(commands5[0].command).toMatchObject({
			type: 'visible',
			channel: 0,
			value: false,
		})
	})

	test('Sisyfos: set lookahead and take to pgm, with lookahead still on', async () => {
		const myChannelMapping0: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 0,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping1: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping2: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping3: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 3,
				setLabelToLayerName: false,
			},
		}
		const mappings: Mappings = {
			sisyfos_channel_1: myChannelMapping0,
			sisyfos_channel_2: myChannelMapping1,
			sisyfos_channel_2_lookahead: myChannelMapping2,
			sisyfos_channel_3: myChannelMapping3,
		}

		const device = getSisyfosDevice()

		const state0 = createTimelineState({
			sisyfos_channel_2_lookahead: {
				id: 'obj0',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					isPgm: 1,
				},
				isLookahead: true,
				lookaheadForLayer: 'sisyfos_channel_2',
			},
		})
		const state1 = createTimelineState({
			sisyfos_channel_2: {
				id: 'obj1',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					isPgm: 1,
				},
			},
			sisyfos_channel_2_lookahead: {
				id: 'obj2',
				content: {
					deviceType: DeviceType.SISYFOS,
					type: TimelineContentTypeSisyfos.CHANNEL,

					isPgm: 0,
				},
				isLookahead: true,
				lookaheadForLayer: 'sisyfos_channel_2',
			},
		})

		const sisyfosState0 = device.convertTimelineStateToDeviceState(state0, mappings)
		const sisyfosState1 = device.convertTimelineStateToDeviceState(state1, mappings)
		const commands = device.diffStates(sisyfosState0, sisyfosState1)

		expect(commands).toHaveLength(2)
		expect(commands[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 1,
			values: [1],
		})
		expect(commands[1].command).toMatchObject({
			type: 'togglePst',
			channel: 1,
			value: 0,
		})
	})

	test('Sisyfos: using CHANNELS', async () => {
		const myChannelMapping0: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channels,
			},
		}
		const myChannelMapping1: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping2: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 2,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping3: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channels,
			},
		}
		const mappings: Mappings = {
			sisyfos_channels_base: myChannelMapping0,
			sisyfos_channel_1: myChannelMapping1,
			sisyfos_channel_2: myChannelMapping2,
			sisyfos_channels: myChannelMapping3,
		}

		const device = getSisyfosDevice()

		const baselineObj = {
			id: 'baseline',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNELS,

				channels: [
					{
						mappedLayer: 'sisyfos_channel_1',
						faderLevel: 0.1,
						isPgm: 0,
					},
					{
						mappedLayer: 'sisyfos_channel_2',
						faderLevel: 0.2,
						isPgm: 0,
						fadeTime: 500,
					},
				],
				overridePriority: -999,
			} satisfies TimelineContentSisyfosAny,
		}
		const state0 = createTimelineState({})
		const state1 = createTimelineState({
			sisyfos_channels_base: baselineObj,
		})
		const sisyfosState0 = device.convertTimelineStateToDeviceState(state0, mappings)
		const sisyfosState1 = device.convertTimelineStateToDeviceState(state1, mappings)
		const commands1 = device.diffStates(sisyfosState0, sisyfosState1)

		expect(commands1).toHaveLength(2)
		expect(commands1[0].command).toMatchObject({
			type: 'setFader',
			channel: 1,
			values: [0.1],
		})
		expect(commands1[1].command).toMatchObject({
			type: 'setFader',
			channel: 2,
			values: [0.2, 500],
		})

		const obj1 = {
			id: 'obj1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNEL,
				isPgm: 1,
			} satisfies TimelineContentSisyfosAny,
		}
		const state2 = createTimelineState({
			sisyfos_channels_base: baselineObj,
			sisyfos_channel_1: obj1,
		})
		const sisyfosState2 = device.convertTimelineStateToDeviceState(state2, mappings)
		const commands2 = device.diffStates(sisyfosState1, sisyfosState2)

		expect(commands2).toHaveLength(1)
		expect(commands2[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 1,
			values: [1],
		})

		const obj2 = {
			id: 'obj2',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNEL,
				isPgm: 1,
			} satisfies TimelineContentSisyfosAny,
		}
		const state3 = createTimelineState({
			sisyfos_channels_base: baselineObj,
			sisyfos_channel_1: obj1,
			sisyfos_channel_2: obj2,
		})
		const sisyfosState3 = device.convertTimelineStateToDeviceState(state3, mappings)
		const commands3 = device.diffStates(sisyfosState2, sisyfosState3)
		expect(commands3).toHaveLength(1)
		expect(commands3[0].command).toMatchObject({
			type: 'togglePgm',
			channel: 2,
			values: [1, 500],
		})

		const obj3 = {
			id: 'obj3',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNELS,

				channels: [
					{
						mappedLayer: 'sisyfos_channel_1',
						faderLevel: 0.75,
					},
					{
						mappedLayer: 'sisyfos_channel_2',
						faderLevel: 0.74,
						fadeTime: 500,
					},
				],
				overridePriority: -999,
			} satisfies TimelineContentSisyfosAny,
		}

		const state4 = createTimelineState({
			sisyfos_channels_base: baselineObj,
			sisyfos_channel_1: obj1,
			sisyfos_channel_2: obj2,
			sisyfos_channels: obj3,
		})
		const sisyfosState4 = device.convertTimelineStateToDeviceState(state4, mappings)
		const commands4 = device.diffStates(sisyfosState3, sisyfosState4)
		expect(commands4).toHaveLength(2)
		expect(commands4[0].command).toMatchObject({
			type: 'setFader',
			channel: 1,
			values: [0.75],
		})
		expect(commands4[1].command).toMatchObject({
			type: 'setFader',
			channel: 2,
			values: [0.74, 500],
		})

		const state5 = createTimelineState({
			sisyfos_channels_base: baselineObj,
			sisyfos_channel_1: obj1,
		})
		const sisyfosState5 = device.convertTimelineStateToDeviceState(state5, mappings)
		const commands5 = device.diffStates(sisyfosState4, sisyfosState5)
		expect(commands5).toHaveLength(3)
		expect(commands5[0].command).toMatchObject({
			type: 'setFader',
			channel: 1,
			values: [0.1],
		})
		expect(commands5[1].command).toMatchObject({
			type: 'togglePgm',
			channel: 2,
			values: [0, 500],
		})
		expect(commands5[2].command).toMatchObject({
			type: 'setFader',
			channel: 2,
			values: [0.2, 500],
		})
	})

	test('Sisyfos: using global triggerValue', async () => {
		const myChannelMapping0: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channels,
			},
		}
		const myChannelMapping1: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping2: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 2,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping3: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channels,
			},
		}
		const myTriggerMapping0: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channels,
			},
		}
		const mappings: Mappings = {
			sisyfos_channels_base: myChannelMapping0,
			sisyfos_channels_base_trigger: myTriggerMapping0,
			sisyfos_channel_1: myChannelMapping1,
			sisyfos_channel_2: myChannelMapping2,
			sisyfos_channels: myChannelMapping3,
		}

		const device = getSisyfosDevice()

		const baselineObj = {
			id: 'baseline',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNELS,

				channels: [
					{
						mappedLayer: 'sisyfos_channel_1',
						faderLevel: 0.1,
						isPgm: 0,
					},
					{
						mappedLayer: 'sisyfos_channel_2',
						faderLevel: 0.2,
						isPgm: 0,
					},
				],
				overridePriority: -999,
			} satisfies TimelineContentSisyfosAny,
		}
		const baselineTriggerObj = {
			id: 'baseline_trigger',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.TRIGGERVALUE,
				triggerValue: 'a',
			} satisfies TimelineContentSisyfosAny,
		}
		const obj1 = {
			id: 'obj1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.TRIGGERVALUE,
				triggerValue: 'b',
			} satisfies TimelineContentSisyfosAny,
		}
		const obj2 = {
			id: 'obj2',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNEL,

				isPgm: 1,
			} satisfies TimelineContentSisyfosAny,
		}
		const state0 = createTimelineState({})
		const state1 = createTimelineState({
			sisyfos_channels_base: baselineObj,
			sisyfos_channels_base_trigger: baselineTriggerObj,
		})
		const sisyfosState0 = device.convertTimelineStateToDeviceState(state0, mappings)
		const sisyfosState1 = device.convertTimelineStateToDeviceState(state1, mappings)
		const commands1 = device.diffStates(sisyfosState0, sisyfosState1)
		expect(commands1).toHaveLength(2)
		expect(commands1[0].command).toMatchObject({
			type: 'setChannel',
			channel: 1,
			values: {
				faderLevel: 0.1,
				pgmOn: 0,
			},
		})
		expect(commands1[1].command).toMatchObject({
			type: 'setChannel',
			channel: 2,
			values: {
				faderLevel: 0.2,
				pgmOn: 0,
			},
		})

		const state2 = createTimelineState({
			sisyfos_channels_base: baselineObj,
			sisyfos_channels_base_trigger: baselineTriggerObj,
			sisyfos_channel_1: obj1,
			sisyfos_channel_2: obj2,
		})
		const sisyfosState2 = device.convertTimelineStateToDeviceState(state2, mappings)
		const commands2 = device.diffStates(sisyfosState1, sisyfosState2)
		expect(commands2).toHaveLength(2)
		expect(commands2[0].command).toMatchObject({
			type: 'setChannel',
			channel: 1,
			values: {
				faderLevel: 0.1,
				pgmOn: 0,
			},
		})
		expect(commands2[1].command).toMatchObject({
			type: 'setChannel',
			channel: 2,
			values: {
				faderLevel: 0.2,
				pgmOn: 1,
			},
		})

		const state3 = createTimelineState({
			sisyfos_channels_base: baselineObj,
			sisyfos_channels_base_trigger: baselineTriggerObj,
		})
		const sisyfosState3 = device.convertTimelineStateToDeviceState(state3, mappings)
		const commands3 = device.diffStates(sisyfosState2, sisyfosState3)
		expect(commands3).toHaveLength(2)
		expect(commands3[0].command).toMatchObject({
			type: 'setChannel',
			channel: 1,
			values: {
				faderLevel: 0.1,
				pgmOn: 0,
			},
		})
		expect(commands3[1].command).toMatchObject({
			type: 'setChannel',
			channel: 2,
			values: {
				faderLevel: 0.2,
				pgmOn: 0,
			},
		})
	})

	test('Sisyfos: using per-channel triggerValue - initially defined', async () => {
		const myChannelMapping0: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channels,
			},
		}
		const myChannelMapping1: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping2: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 2,
				setLabelToLayerName: false,
			},
		}
		const mappings: Mappings = {
			sisyfos_channels_base: myChannelMapping0,
			sisyfos_channel_1: myChannelMapping1,
			sisyfos_channel_2: myChannelMapping2,
		}

		const device = getSisyfosDevice()

		const baselineObj = {
			id: 'baseline',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNELS,

				channels: [
					{
						mappedLayer: 'sisyfos_channel_1',
						faderLevel: 0.1,
						isPgm: 0,
					},
					{
						mappedLayer: 'sisyfos_channel_2',
						faderLevel: 0.2,
						isPgm: 0,
					},
				],
				overridePriority: -999,
				triggerValue: 'a',
			} satisfies TimelineContentSisyfosAny,
		}
		const obj1 = {
			id: 'obj1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNEL,

				triggerValue: 'b',
			} satisfies TimelineContentSisyfosAny,
		}

		const state0 = createTimelineState({})
		const state1 = createTimelineState({
			sisyfos_channels_base: baselineObj,
		})
		const sisyfosState0 = device.convertTimelineStateToDeviceState(state0, mappings)
		const sisyfosState1 = device.convertTimelineStateToDeviceState(state1, mappings)
		const commands1 = device.diffStates(sisyfosState0, sisyfosState1)
		expect(commands1).toHaveLength(2)
		expect(commands1[0].command).toMatchObject({
			type: 'setChannel',
			channel: 1,
			values: {
				faderLevel: 0.1,
				pgmOn: 0,
			},
		})
		expect(commands1[1].command).toMatchObject({
			type: 'setChannel',
			channel: 2,
			values: {
				faderLevel: 0.2,
				pgmOn: 0,
			},
		})

		const state2 = createTimelineState({
			sisyfos_channels_base: baselineObj,
			sisyfos_channel_2: obj1,
		})
		const sisyfosState2 = device.convertTimelineStateToDeviceState(state2, mappings)
		const commands2 = device.diffStates(sisyfosState1, sisyfosState2)
		expect(commands2).toHaveLength(1)
		expect(commands2[0].command).toMatchObject({
			type: 'setChannel',
			channel: 2,
			values: {
				faderLevel: 0.2,
				pgmOn: 0,
			},
		})

		const state3 = createTimelineState({
			sisyfos_channels_base: baselineObj,
		})
		const sisyfosState3 = device.convertTimelineStateToDeviceState(state3, mappings)
		const commands3 = device.diffStates(sisyfosState2, sisyfosState3)
		expect(commands3).toHaveLength(1)
		expect(commands3[0].command).toMatchObject({
			type: 'setChannel',
			channel: 2,
			values: {
				faderLevel: 0.2,
				pgmOn: 0,
			},
		})
	})

	test('Sisyfos: using per-channel triggerValue - initially undefined', async () => {
		const myChannelMapping0: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channels,
			},
		}
		const myChannelMapping1: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 1,
				setLabelToLayerName: false,
			},
		}
		const myChannelMapping2: Mapping<SomeMappingSisyfos> = {
			device: DeviceType.SISYFOS,
			deviceId: 'mySisyfos',
			options: {
				mappingType: MappingSisyfosType.Channel,
				channel: 2,
				setLabelToLayerName: false,
			},
		}
		const mappings: Mappings = {
			sisyfos_channels_base: myChannelMapping0,
			sisyfos_channel_1: myChannelMapping1,
			sisyfos_channel_2: myChannelMapping2,
		}

		const device = getSisyfosDevice()

		const baselineObj = {
			id: 'baseline',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNELS,

				channels: [
					{
						mappedLayer: 'sisyfos_channel_1',
						faderLevel: 0.1,
						isPgm: 0,
					},
					{
						mappedLayer: 'sisyfos_channel_2',
						faderLevel: 0.2,
						isPgm: 0,
					},
				],
				overridePriority: -999,
				// triggerValue: 'a', - the only input-difference between the case above
			} satisfies TimelineContentSisyfosAny,
		}
		const obj1 = {
			id: 'obj1',
			content: {
				deviceType: DeviceType.SISYFOS,
				type: TimelineContentTypeSisyfos.CHANNEL,

				triggerValue: 'b',
			} satisfies TimelineContentSisyfosAny,
		}

		const state0 = createTimelineState({})
		const state1 = createTimelineState({
			sisyfos_channels_base: baselineObj,
		})
		const sisyfosState0 = device.convertTimelineStateToDeviceState(state0, mappings)
		const sisyfosState1 = device.convertTimelineStateToDeviceState(state1, mappings)
		const commands1 = device.diffStates(sisyfosState0, sisyfosState1)
		expect(commands1).toHaveLength(2)
		expect(commands1[0].command).toMatchObject({
			type: 'setFader',
			channel: 1,
			values: [0.1],
		})
		expect(commands1[1].command).toMatchObject({
			type: 'setFader',
			channel: 2,
			values: [0.2],
		})

		const state2 = createTimelineState({
			sisyfos_channels_base: baselineObj,
			sisyfos_channel_2: obj1,
		})
		const sisyfosState2 = device.convertTimelineStateToDeviceState(state2, mappings)
		const commands2 = device.diffStates(sisyfosState1, sisyfosState2)
		expect(commands2).toHaveLength(1)
		expect(commands2[0].command).toMatchObject({
			type: 'setChannel',
			channel: 2,
			values: {
				faderLevel: 0.2,
				pgmOn: 0,
			},
		})

		const state3 = createTimelineState({
			sisyfos_channels_base: baselineObj,
		})
		const sisyfosState3 = device.convertTimelineStateToDeviceState(state3, mappings)
		const commands3 = device.diffStates(sisyfosState2, sisyfosState3)
		expect(commands3).toHaveLength(0)
	})

	test('Connection status', async () => {
		await mockTime.advanceTimeToTicks(10100)

		const context = getDeviceContext()
		const device = getSisyfosDevice(context)

		await device.init({
			host: '192.168.0.10',
			port: 8900,
		})

		// Wait for the connection to be initialized:
		await waitUntil(
			async () => {
				expect(device.connected).toEqual(true)
			},
			1000,
			mockTime
		)

		// Simulate a connection loss:
		MockOSC.connectionIsGood = false

		// Wait for the OSC timeout to trigger:
		await mockTime.advanceTimeTicks(3000)
		await wait(1)
		await mockTime.advanceTimeTicks(3000)
		await wait(1)

		expect(device.connected).toEqual(false)

		expect(context.connectionChanged.mock.calls.length).toBeGreaterThanOrEqual(1)
		context.connectionChanged.mockClear()

		// Simulate a connection regain:
		MockOSC.connectionIsGood = true
		await mockTime.advanceTimeTicks(3000)
		await wait(1)
		await mockTime.advanceTimeTicks(3000)
		await wait(1)

		expect(device.connected).toEqual(true)
		expect(context.connectionChanged.mock.calls.length).toBeGreaterThanOrEqual(1)
	})

	describe('convertTimelineStateToDeviceState', () => {
		async function convertState(
			tlState: DeviceTimelineState<TSRTimelineContent>,
			mappings: Mappings<SomeMappingSisyfos>
		) {
			const device = getSisyfosDevice()

			return device.convertTimelineStateToDeviceState(tlState, mappings)
		}

		test('convert empty state', async () => {
			expect(await convertState(createTimelineState({}), {})).toEqual({ channels: {}, resync: false })
		})

		it('applies mapping defaults for channel when disableDefaults!==true', async () => {
			expect(
				await convertState(createTimelineState({}), {
					channel0: {
						device: DeviceType.SISYFOS,
						deviceId: 'sisyfos0',
						options: {
							channel: 0,
							mappingType: MappingSisyfosType.Channel,
						},
					},
				})
			).toEqual({
				channels: {
					0: {
						faderLevel: 0.75,
						inputGain: 0.75,
						inputSelector: 1,
						muteOn: false,
						label: '',
						pgmOn: 0,
						pstOn: 0,
						timelineObjIds: [],
						visible: true,
					},
				},
				resync: false,
			})
		})

		it('applies mapping defaults for channels when disableDefaults!==true', async () => {
			expect(
				await convertState(
					createTimelineState({
						channels: {
							id: 'channelsTlObj',
							content: {
								deviceType: DeviceType.SISYFOS,
								type: TimelineContentTypeSisyfos.CHANNELS,
								channels: [{ mappedLayer: 'channel0' }, { mappedLayer: 'channel1' }],
							},
						},
					}),
					{
						channel0: {
							device: DeviceType.SISYFOS,
							deviceId: 'sisyfos0',
							options: {
								channel: 0,
								mappingType: MappingSisyfosType.Channel,
							},
						},
						channel1: {
							device: DeviceType.SISYFOS,
							deviceId: 'sisyfos0',
							options: {
								channel: 1,
								mappingType: MappingSisyfosType.Channel,
							},
						},
						channels: {
							device: DeviceType.SISYFOS,
							deviceId: 'sisyfos0',
							options: {
								mappingType: MappingSisyfosType.Channels,
							},
						},
					}
				)
			).toEqual({
				channels: {
					0: {
						faderLevel: 0.75,
						inputGain: 0.75,
						inputSelector: 1,
						muteOn: false,
						label: '',
						pgmOn: 0,
						pstOn: 0,
						timelineObjIds: ['channelsTlObj'],
						visible: true,
					},
					1: {
						faderLevel: 0.75,
						inputGain: 0.75,
						inputSelector: 1,
						muteOn: false,
						label: '',
						pgmOn: 0,
						pstOn: 0,
						timelineObjIds: ['channelsTlObj'],
						visible: true,
					},
				},
				resync: false,
			})
		})

		it('does not apply mapping defaults for channel when disableDefaults===true', async () => {
			expect(
				await convertState(createTimelineState({}), {
					channel0: {
						device: DeviceType.SISYFOS,
						deviceId: 'sisyfos0',
						options: {
							channel: 0,
							mappingType: MappingSisyfosType.Channel,
							disableDefaults: true,
						},
					},
				})
			).toEqual({
				channels: {
					0: {
						faderLevel: undefined,
						label: '',
						inputGain: undefined,
						inputSelector: undefined,
						muteOn: undefined,
						pgmOn: undefined,
						pstOn: undefined,
						timelineObjIds: [],
						visible: undefined,
					},
				},
				resync: false,
			})
		})

		it('only applies properties present in the timeline object when disableDefaults===true', async () => {
			expect(
				await convertState(
					createTimelineState({
						channel0: {
							id: 'channelTlObj',
							content: {
								deviceType: DeviceType.SISYFOS,
								type: TimelineContentTypeSisyfos.CHANNEL,
								isPgm: 2,
							},
						},
					}),
					{
						channel0: {
							device: DeviceType.SISYFOS,
							deviceId: 'sisyfos0',
							options: {
								channel: 0,
								mappingType: MappingSisyfosType.Channel,
								disableDefaults: true,
							},
						},
					}
				)
			).toEqual({
				channels: {
					0: {
						faderLevel: undefined,
						label: '',
						pgmOn: 2,
						inputGain: undefined,
						inputSelector: undefined,
						muteOn: undefined,
						pstOn: undefined,
						timelineObjIds: ['channelTlObj'],
						visible: undefined,
					},
				},
				resync: false,
			})
		})

		it('does not apply mapping defaults for mapped channels when their disableDefaults===true', async () => {
			expect(
				await convertState(
					createTimelineState({
						channels: {
							id: 'channelsTlObj',
							content: {
								deviceType: DeviceType.SISYFOS,
								type: TimelineContentTypeSisyfos.CHANNELS,
								channels: [{ mappedLayer: 'channel0' }, { mappedLayer: 'channel1' }],
							},
						},
					}),
					{
						channel0: {
							device: DeviceType.SISYFOS,
							deviceId: 'sisyfos0',
							options: {
								channel: 0,
								mappingType: MappingSisyfosType.Channel,
								disableDefaults: true,
							},
						},
						channel1: {
							device: DeviceType.SISYFOS,
							deviceId: 'sisyfos0',
							options: {
								channel: 1,
								mappingType: MappingSisyfosType.Channel,
								disableDefaults: true,
							},
						},
						channels: {
							device: DeviceType.SISYFOS,
							deviceId: 'sisyfos0',
							options: {
								mappingType: MappingSisyfosType.Channels,
							},
						},
					}
				)
			).toEqual({
				channels: {
					0: {
						faderLevel: undefined,
						label: '',
						inputGain: undefined,
						inputSelector: undefined,
						muteOn: undefined,
						pgmOn: undefined,
						pstOn: undefined,
						timelineObjIds: ['channelsTlObj'],
						visible: undefined,
					},
					1: {
						faderLevel: undefined,
						label: '',
						inputGain: undefined,
						inputSelector: undefined,
						muteOn: undefined,
						pgmOn: undefined,
						pstOn: undefined,
						timelineObjIds: ['channelsTlObj'],
						visible: undefined,
					},
				},
				resync: false,
			})
		})
	})

	describe('diffState', () => {
		async function compareStates(oldDevState: SisyfosState | undefined, newDevState: SisyfosState) {
			const device = getSisyfosDevice()
			return device.diffStates(oldDevState, newDevState)
		}

		test('From undefined', async () => {
			expect(await compareStates(undefined, { channels: {}, resync: false })).toEqual([])
		})

		it('sends commands only for defined properties', async () => {
			expect(
				await compareStates(
					{
						channels: {
							0: {
								faderLevel: undefined,
								label: '',
								timelineObjIds: [],
								pgmOn: undefined,
								pstOn: undefined,
								visible: undefined,
								inputGain: undefined,
								inputSelector: undefined,
								muteOn: undefined,
							},
						},
						resync: false,
					},
					{
						channels: {
							0: {
								faderLevel: undefined,
								label: '',
								timelineObjIds: [],
								pgmOn: 2,
								pstOn: undefined,
								visible: undefined,
								inputGain: undefined,
								inputSelector: undefined,
								muteOn: undefined,
							},
						},
						resync: false,
					}
				)
			).toEqual([
				expect.objectContaining({
					command: {
						channel: 0,
						type: SisyfosCommandType.TOGGLE_PGM,
						values: [2],
					},
				}),
			])
		})

		it("doesn't emit commands for empty `label` string", async () => {
			expect(
				await compareStates(
					{
						channels: {
							0: {
								faderLevel: undefined,
								label: 'asfdadf asdfadsf',
								timelineObjIds: [],
								pgmOn: undefined,
								pstOn: undefined,
								visible: undefined,
								inputGain: undefined,
								inputSelector: undefined,
								muteOn: undefined,
							},
						},
						resync: false,
					},
					{
						channels: {
							0: {
								faderLevel: undefined,
								label: '',
								timelineObjIds: [],
								pgmOn: undefined,
								pstOn: undefined,
								visible: undefined,
								inputGain: undefined,
								inputSelector: undefined,
								muteOn: undefined,
							},
						},
						resync: false,
					}
				)
			).toHaveLength(0)
		})
	})
})

function getSisyfosDevice(mockContext?: DeviceContextAPI<any>) {
	const dev = new SisyfosMessageDevice(mockContext ?? getDeviceContext())
	return dev
}

type SisyfosTimelineObject = Pick<
	DeviceTimelineStateObject<TimelineContentSisyfosAny>,
	'id' | 'content' | 'isLookahead' | 'lookaheadForLayer'
>

function createTimelineState(objs: Record<string, SisyfosTimelineObject>): DeviceTimelineState<TSRTimelineContent> {
	return {
		time: 10,
		objects: Object.entries<SisyfosTimelineObject>(objs).map(([layer, obj]) => {
			return {
				...obj,
				layer,
				enable: { start: 0 },
				priority: 1,
				instance: { id: '@0', start: 0, end: null, references: [] } as Timeline.TimelineObjectInstance,
			} as DeviceTimelineStateObject<TSRTimelineContent>
		}),
	}
}
