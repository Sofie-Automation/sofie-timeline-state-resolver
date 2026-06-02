import {
	DeviceType,
	MappingVindralComposerType,
	type Mappings,
	type SomeMappingVindralComposer,
	TimelineContentTypeVindralComposer,
} from 'timeline-state-resolver-types'
import { buildVindralState } from '../stateBuilder.js'
import { makeDeviceTimelineStateObject } from '../../../__mocks__/objects.js'
import { EMPTY_STATE } from './lib.js'

const MAPPINGS: Mappings<SomeMappingVindralComposer> = {
	connLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: { mappingType: MappingVindralComposerType.Connector },
	},
	slLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: { mappingType: MappingVindralComposerType.SceneLayer, scene: 'main', layer: 'bg' },
	},
	seLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: { mappingType: MappingVindralComposerType.ScriptEngine, functionName: 'myFunc' },
	},
}

describe('stateBuilder', () => {
	test('empty timeline → empty state', () => {
		expect(buildVindralState({ time: 123, objects: [] }, MAPPINGS)).toStrictEqual({
			...EMPTY_STATE,
			stateTime: 123,
		})
	})

	test('connector mapping', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'connLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.CONNECTOR,
							connector: { name: 'cam1' },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result).toStrictEqual({
			stateTime: 0,
			connectors: {
				connLayer: { name: 'cam1', value: undefined, params: undefined, timelineObjIds: ['obj0'] },
			},
			sceneLayers: {},
			scriptEngines: {},
		})
	})

	test('scene-layer mapping', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'slLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SCENE_LAYER,
							sceneLayer: { source: 'camera-1' },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result).toStrictEqual({
			stateTime: 0,
			connectors: {},
			sceneLayers: {
				'main/bg': { scene: 'main', layer: 'bg', source: 'camera-1', timelineObjIds: ['obj0'] },
			},
			scriptEngines: {},
		})
	})

	test('script-engine mapping', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'seLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SCRIPT_ENGINE,
							scriptEngine: { parameter: { speed: 2 } },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result).toStrictEqual({
			stateTime: 0,
			connectors: {},
			sceneLayers: {},
			scriptEngines: {
				myFunc: { functionName: 'myFunc', parameter: { speed: 2 }, timelineObjIds: ['obj0'] },
			},
		})
	})

	test('object with wrong device type is ignored', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'connLayer',
						content: {
							deviceType: DeviceType.ABSTRACT,
							type: 'something',
						} as any,
					}),
				],
			},
			MAPPINGS
		)
		expect(result).toStrictEqual({ ...EMPTY_STATE, stateTime: 0 })
	})
})
