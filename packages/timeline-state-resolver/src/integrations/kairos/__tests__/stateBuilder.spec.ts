import {
	DeviceType,
	MappingKairosType,
	Mappings,
	SomeMappingKairos,
	TimelineContentTypeKairos,
} from 'timeline-state-resolver-types'
import { KairosStateBuilder } from '../stateBuilder'
import { EMPTY_STATE } from './lib'
import { makeDeviceTimelineStateObject } from '../../../__mocks__/objects'
import { refIpInput } from 'kairos-connection'

describe('stateBuilder', () => {
	const DEFAULT_MAPPINGS: Mappings<SomeMappingKairos> = {
		mainScene: {
			device: DeviceType.KAIROS,
			deviceId: 'kairos0',
			options: {
				mappingType: MappingKairosType.Scene,
				sceneName: ['Main'],
			},
		},
		mainSceneBackgroundLayer: {
			device: DeviceType.KAIROS,
			deviceId: 'kairos0',
			options: {
				mappingType: MappingKairosType.SceneLayer,
				sceneName: ['Main'],
				layerName: ['Background'],
			},
		},
	}
	test('empty state', () => {
		expect(
			KairosStateBuilder.fromTimeline(
				{
					objects: [],
					time: 123,
				},
				DEFAULT_MAPPINGS
			)
		).toStrictEqual({ ...EMPTY_STATE, stateTime: 123 })
	})
	test('Set', () => {
		expect(
			KairosStateBuilder.fromTimeline(
				{
					objects: [
						makeDeviceTimelineStateObject({
							enable: { start: 10000 },
							id: 'obj0',
							layer: 'mainSceneBackgroundLayer',
							content: {
								deviceType: DeviceType.KAIROS,
								type: TimelineContentTypeKairos.SCENE_LAYER,
								sceneLayer: {
									sourcePgm: refIpInput(1),
								},
							},
						}),
					],
					time: 0,
				},
				DEFAULT_MAPPINGS
			)
		).toStrictEqual({
			...EMPTY_STATE,
			stateTime: 0,
			sceneLayers: {
				'SCENES.Main.Layers.Background': {
					ref: {
						layerPath: ['Background'],
						realm: 'scene-layer',
						scenePath: ['Main'],
					},
					state: {
						sourcePgm: {
							ipInput: 1,
							realm: 'ip-input',
						},
					},
					timelineObjIds: ['obj0'],
				},
			},
		})
	})
})
