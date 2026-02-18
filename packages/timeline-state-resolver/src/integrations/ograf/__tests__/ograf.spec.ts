/* eslint-disable jest/expect-expect */
import {
	DeviceType,
	TimelineContentTypeOgraf,
	MappingOgrafType,
	TimelineContentOgrafAny,
} from 'timeline-state-resolver-types'

const MOCKED_SOCKET_GET = jest.fn()
const MOCKED_SOCKET_POST = jest.fn()
const MOCKED_SOCKET_PUT = jest.fn()
const MOCKED_SOCKET_DELETE = jest.fn()

jest.mock('got', () => {
	return {
		default: {
			get: MOCKED_SOCKET_GET,
			post: MOCKED_SOCKET_POST,
			put: MOCKED_SOCKET_PUT,
			delete: MOCKED_SOCKET_DELETE,
		},
	}
})

// note - this import should be below the got mock
import { OGrafDevice } from '../index.js'
import { getDeviceContext } from '../../__tests__/testlib.js'
import { OGrafDeviceState } from '../ografState.js'
import { OGrafDeviceCommand } from '../types.js'
import { DeviceTimelineStateObject } from 'timeline-state-resolver-api'

async function getInitialisedOGrafDevice() {
	const dev = new OGrafDevice(getDeviceContext())
	await dev.init({
		url: 'http://localhost'
	})
	return dev
}

describe('OGraf', () => {
	beforeEach(() => {
		MOCKED_SOCKET_GET.mockReset()
		MOCKED_SOCKET_POST.mockReset()
		MOCKED_SOCKET_PUT.mockReset()
		MOCKED_SOCKET_DELETE.mockReset()

		MOCKED_SOCKET_GET.mockResolvedValue(Promise.resolve({ statusCode: 200 }))
		MOCKED_SOCKET_POST.mockResolvedValue(Promise.resolve({ statusCode: 200 }))
		MOCKED_SOCKET_PUT.mockResolvedValue(Promise.resolve({ statusCode: 200 }))
		MOCKED_SOCKET_DELETE.mockResolvedValue(Promise.resolve({ statusCode: 200 }))
	})

	describe('convertState', () => {
		test('empty state', async () => {
			const device = await getInitialisedOGrafDevice()

			const state = device.convertTimelineStateToDeviceState(
				{
					time: 0,
					objects: [],
				},
				{}
			)

			expect(state).toEqual({
				graphics: {},
				graphicsStepDelta: {},
				rendererCustomActions: {},
			})
		})
		test('One graphic', async () => {
			const device = await getInitialisedOGrafDevice()

			const state = device.convertTimelineStateToDeviceState(
				{
					time: 0,
					objects: [
						{
							...DEFAULT_RESOLVED_OBJECT_INSTANCE,
							id: 'obj0',
							content: {
								deviceType: DeviceType.OGRAF,
								type: TimelineContentTypeOgraf.GRAPHIC,
								graphicId: 'testGraphic',
								playing: true,
								useStopCommand: true,
								data: { a: 1 },
								skipAnimation: false,
								goToStep: 2,
								customActions: {
									a0: {
										id: 'action0',
										payload: { b: 1 },
										triggerValue: 42,
									},
								},
							},
						},
					] satisfies DeviceTimelineStateObject<TimelineContentOgrafAny>[],
				},
				{
					layer0: {
						device: DeviceType.OGRAF,
						deviceId: 'dev0',
						options: {
							mappingType: MappingOgrafType.RenderTarget,
							rendererId: 'renderer0',
							renderTarget: '{"layerId": "layer0"}',
						},
					},
				}
			)

			expect(state).toStrictEqual({
				graphics: {
					layer0: {
						timelineObjId: 'obj0',
						rendererId: 'renderer0',
						renderTarget: '{"layerId": "layer0"}',
						content: {
							deviceType: DeviceType.OGRAF,
							type: TimelineContentTypeOgraf.GRAPHIC,
							graphicId: 'testGraphic',
							playing: true,
							useStopCommand: true,
							data: { a: 1 },
							skipAnimation: false,
							goToStep: 2,
							customActions: {
								a0: {
									id: 'action0',
									payload: { b: 1 },
									triggerValue: 42,
								},
							},
						},
					},
				},
				graphicsStepDelta: {},
				rendererCustomActions: {},
			} satisfies OGrafDeviceState)
		})
		test('One Renderer CustomAction', async () => {
			const device = await getInitialisedOGrafDevice()

			const state = device.convertTimelineStateToDeviceState(
				{
					time: 0,
					objects: [
						{
							...DEFAULT_RESOLVED_OBJECT_INSTANCE,
							id: 'obj0',
							content: {
								deviceType: DeviceType.OGRAF,
								type: TimelineContentTypeOgraf.RENDERER_CUSTOM_ACTION,
								customActions: {
									r0: {
										id: 'action0',
										payload: { b: 1 },
										triggerValue: 42,
									},
								},
							},
						},
					],
				},
				{
					layer0: {
						device: DeviceType.OGRAF,
						deviceId: 'dev0',
						options: {
							mappingType: MappingOgrafType.Renderer,
							rendererId: 'renderer0',
						},
					},
				}
			)

			expect(state).toStrictEqual({
				graphics: {},
				graphicsStepDelta: {},
				rendererCustomActions: {
					layer0: {
						timelineObjId: 'obj0',
						rendererId: 'renderer0',
						action: {
							deviceType: DeviceType.OGRAF,
							type: TimelineContentTypeOgraf.RENDERER_CUSTOM_ACTION,
							customActions: {
								r0: {
									id: 'action0',
									payload: { b: 1 },
									triggerValue: 42,
								},
							},
						},
					},
				},
			} satisfies OGrafDeviceState)
		})
		test('Step Delta', async () => {
			const device = await getInitialisedOGrafDevice()

			const state = device.convertTimelineStateToDeviceState(
				{
					time: 0,
					objects: [
						{
							...DEFAULT_RESOLVED_OBJECT_INSTANCE,
							id: 'obj0',
							content: {
								deviceType: DeviceType.OGRAF,
								type: TimelineContentTypeOgraf.GRAPHIC_STEP,
								graphicId: 'testGraphic',
								delta: 1,
								triggerValue: 42,
							},
						},
					],
				},
				{
					layer0: {
						device: DeviceType.OGRAF,
						deviceId: 'dev0',
						options: {
							mappingType: MappingOgrafType.RenderTarget,
							rendererId: 'renderer0',
							renderTarget: '{"layerId": "layer0"}',
						},
					},
				}
			)

			expect(state).toStrictEqual({
				graphics: {},
				graphicsStepDelta: {
					layer0: {
						timelineObjId: 'obj0',
						rendererId: 'renderer0',
						renderTarget: '{"layerId": "layer0"}',
						content: {
							deviceType: DeviceType.OGRAF,
							type: TimelineContentTypeOgraf.GRAPHIC_STEP,
							delta: 1,
							graphicId: 'testGraphic',
							triggerValue: 42,
						},
					},
				},
				rendererCustomActions: {},
			} satisfies OGrafDeviceState)
		})
	})
	describe('diffState', () => {
		async function compareStates(
			oldDevState: OGrafDeviceState | undefined,
			newDevState: OGrafDeviceState,
			expCommands: OGrafDeviceCommand[]
		) {
			const device = await getInitialisedOGrafDevice()

			const commands = device.diffStates(oldDevState, newDevState)

			expect(commands).toEqual(expCommands)
		}
		describe('Graphic', () => {
			test('From undefined', async () => {
				await compareStates(
					undefined,
					{
						graphics: {},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[]
				)
			})
			test('empty states', async () => {
				await compareStates(
					{
						graphics: {},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					{
						graphics: {},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[]
				)
			})
			test('load graphic from empty', async () => {
				await compareStates(
					{
						graphics: {},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: false,
									useStopCommand: false,
									data: { a: 1 },
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `Load graphic: New graphic`,
							command: {
								commandName: 'load',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic',
								data: { a: 1 },
							},
						},
					]
				)
			})
			test('play graphic from empty', async () => {
				await compareStates(
					{
						graphics: {},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: false,
									data: { a: 1 },
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `Load graphic: New graphic`,
							command: {
								commandName: 'load',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic',
								data: { a: 1 },
							},
						},
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `Initial Play`,
							command: {
								commandName: 'play',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic',
								goto: undefined,
								skipAnimation: undefined,
							},
						},
					]
				)
			})
			test('clear graphic', async () => {
				await compareStates(
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: false,
									data: { a: 1 },
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					{
						graphics: {},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `Remove graphic`,
							command: {
								commandName: 'clear',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic',
							},
						},
					]
				)
			})
			test('update graphic data', async () => {
				await compareStates(
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: false,
									data: { a: 1 },
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: false,
									data: { a: 2 },
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `Update: data changed`,
							command: {
								commandName: 'update',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic',
								data: { a: 2 },
								skipAnimation: undefined,
							},
						},
					]
				)
			})
			test('trigger customAction', async () => {
				await compareStates(
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: false,
									data: { a: 1 },
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: false,
									data: { a: 1 },
									customActions: {
										a0: {
											id: 'action0',
											payload: { b: 1 },
										},
									},
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `CustomAction: New action`,
							command: {
								commandName: 'customAction',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic',
								actionId: 'action0',
								payload: { b: 1 },
								skipAnimation: undefined,
							},
						},
					]
				)
				// Using triggerValue
				await compareStates(
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: false,
									data: { a: 1 },
									customActions: {
										a0: {
											id: 'action0',
											payload: { b: 1 },
										},
									},
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: false,
									data: { a: 1 },
									customActions: {
										a0: {
											id: 'action0',
											payload: { b: 1 },
											triggerValue: 42,
										},
									},
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `CustomAction: triggerValue changed from undefined to 42`,
							command: {
								commandName: 'customAction',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic',
								actionId: 'action0',
								payload: { b: 1 },
								skipAnimation: undefined,
							},
						},
					]
				)
			})
			test('replace graphic', async () => {
				await compareStates(
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: true,
									data: { a: 1 },
									customActions: {
										a0: {
											id: 'action0',
											payload: { b: 1 },
										},
									},
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic2', // <-- Another graphic
									playing: true,
									useStopCommand: true,
									data: { a: 2 },
									customActions: {
										a0: {
											id: 'action0',
											payload: { b: 1 },
										},
									},
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `Stop to replace graphic`,
							command: {
								commandName: 'stop',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic',
							},
						},
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `Load graphic: graphicId changed from testGraphic to testGraphic2`,
							command: {
								commandName: 'load',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic2',
								data: { a: 2 },
							},
						},
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `Initial Play`,
							command: {
								commandName: 'play',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic2',
								goto: undefined,
								skipAnimation: undefined,
							},
						},
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `CustomAction: New Graphic loaded`,
							command: {
								commandName: 'customAction',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic2',
								actionId: 'action0',
								payload: { b: 1 },
								skipAnimation: undefined,
							},
						},
					]
				)
			})
			test('Change gotoStep of playing graphic', async () => {
				await compareStates(
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: true,
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					{
						graphics: {
							layer0: {
								timelineObjId: 'obj0',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								content: {
									deviceType: DeviceType.OGRAF,
									type: TimelineContentTypeOgraf.GRAPHIC,
									graphicId: 'testGraphic',
									playing: true,
									useStopCommand: true,
									goToStep: 4, // <-- goToStep changed
								},
							},
						},
						graphicsStepDelta: {},
						rendererCustomActions: {},
					},
					[
						{
							timelineObjId: 'obj0',
							queueId: 'layer0',
							context: `Play: goToStep changed from undefined to 4`,
							command: {
								commandName: 'play',
								rendererId: 'renderer0',
								renderTarget: '{"layerId": "layer0"}',
								layerId: 'layer0',
								graphicId: 'testGraphic',
								goto: 4,
								skipAnimation: undefined,
							},
						},
					]
				)
			})
		})
	})
})
const DEFAULT_RESOLVED_OBJECT_INSTANCE: Pick<DeviceTimelineStateObject<any>, 'priority' | 'layer' | 'instance'> = {
	priority: 0,
	layer: 'layer0',
	instance: {
		id: '@mock',
		start: 0,
		end: null,
		references: [],
	},
}
