import {
	DeviceType,
	Mappings,
	MappingVindralComposerType,
	SomeMappingVindralComposer,
	TimelineContentTypeVindralComposer,
	VindralComposerPlaybackEndCondition,
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
	swLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: { mappingType: MappingVindralComposerType.Switcher, switcherId: 'abc-123' },
	},
	mpLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: {
			mappingType: MappingVindralComposerType.MediaPlayer,
			mediaPlayerId: 'player-guid',
			mediaPlayerName: 'ClipPlayer1',
			autoPlayOnMediaChange: true,
		},
	},
	htmlLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: {
			mappingType: MappingVindralComposerType.Html,
			webPageRendererId: 'html-guid',
			webPageRendererName: 'WebRenderer1',
		},
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
			switchers: {},
			mediaPlayers: {},
			htmlRenderers: {},
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
			switchers: {},
			mediaPlayers: {},
			htmlRenderers: {},
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
			switchers: {},
			mediaPlayers: {},
			htmlRenderers: {},
		})
	})

	test('switcher mapping — all fields', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'swLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER,
							switcher: {
								foregroundInputName: 'cam1',
								backgroundInputName: 'cam2',
								crossfadeTransitionDuration: 500,
								transition: 'crossfade',
							},
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
			scriptEngines: {},
			switchers: {
				'abc-123': {
					selector: { target: 'abc-123' },
					foregroundInputName: 'cam1',
					backgroundInputName: 'cam2',
					crossfadeTransitionDuration: 500,
					transition: 'crossfade',
					timelineObjIds: ['obj0'],
				},
			},
			mediaPlayers: {},
			htmlRenderers: {},
		})
	})

	test('switcher mapping — partial fields', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'swLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER,
							switcher: { foregroundInputName: 'cam3' },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.switchers['abc-123']).toMatchObject({
			selector: { target: 'abc-123' },
			foregroundInputName: 'cam3',
			backgroundInputName: undefined,
			crossfadeTransitionDuration: undefined,
			transition: undefined,
		})
	})

	test('media player mapping — all fields with ID selector', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'mpLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
							mediaPlayer: {
								sourceUrl: 'http://cdn.example.com/clip.mp4',
								inTime: 1000,
								outTime: 5000,
								playbackEndCondition: VindralComposerPlaybackEndCondition.Loop,
								autoPlay: true,
								playing: true,
							},
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.mediaPlayers['mpLayer']).toStrictEqual({
			selector: { target: 'player-guid', targetName: 'ClipPlayer1' },
			autoPlayOnMediaChange: true,
			sourceUrl: 'http://cdn.example.com/clip.mp4',
			inTime: 1000,
			outTime: 5000,
			playbackEndCondition: VindralComposerPlaybackEndCondition.Loop,
			autoPlay: true,
			playing: true,
			timelineObjIds: ['obj0'],
		})
		expect(result.connectors).toStrictEqual({})
		expect(result.switchers).toStrictEqual({})
	})

	test('media player mapping — selector carries both target and targetName', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'mpLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
							mediaPlayer: { sourceUrl: 'http://cdn.example.com/other.mp4' },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.mediaPlayers['mpLayer']).toMatchObject({
			selector: { target: 'player-guid', targetName: 'ClipPlayer1' },
			autoPlayOnMediaChange: true,
			sourceUrl: 'http://cdn.example.com/other.mp4',
		})
	})

	test('media player with wrong content type is ignored', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'mpLayer',
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
		expect(result.mediaPlayers['mpLayer']).toBeUndefined()
	})

	// ── HTML Renderers ────────────────────────────────────────────────────────

	test('html mapping — all fields with ID selector', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'htmlLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.HTML,
							html: { url: 'https://example.com', running: true, reloadKey: 1 },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.htmlRenderers['html-guid']).toStrictEqual({
			selector: { target: 'html-guid' },
			url: 'https://example.com',
			running: true,
			reloadKey: 1,
			timelineObjIds: ['obj0'],
		})
		expect(result.connectors).toStrictEqual({})
		expect(result.mediaPlayers).toStrictEqual({})
	})

	test('html mapping — partial fields (no url)', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'htmlLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.HTML,
							html: { running: false },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.htmlRenderers['html-guid']).toMatchObject({
			selector: { target: 'html-guid' },
			url: undefined,
			running: false,
			reloadKey: undefined,
		})
	})

	test('html mapping with wrong content type is ignored', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'htmlLayer',
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
		expect(result.htmlRenderers['html-guid']).toBeUndefined()
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
