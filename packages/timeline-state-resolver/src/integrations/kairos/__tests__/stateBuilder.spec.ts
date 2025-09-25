import {
	DeviceType,
	MappingKairosType,
	Mappings,
	SomeMappingKairos,
	TimelineContentTypeKairos,
} from 'timeline-state-resolver-types'
import { KairosStateBuilder } from '../stateBuilder'
import { EMPTY_STATE, tlObjectInstance } from './lib'

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
					layers: {},
					nextEvents: [],
					time: 123,
				},
				DEFAULT_MAPPINGS
			)
		).toStrictEqual({ ...EMPTY_STATE, stateTime: 123 })
	})
	test('Set ', () => {
		expect(
			KairosStateBuilder.fromTimeline(
				{
					layers: {
						mainSceneBackgroundLayer: tlObjectInstance(10000, {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourcePgm: {
									realm: 'input',
									path: 'camera1',
								},
							},
						}),
					},
					nextEvents: [],
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
							path: 'camera1',
							realm: 'input',
						},
					},
					timelineObjIds: ['obj0'],
				},
			},
		})
	})
})
