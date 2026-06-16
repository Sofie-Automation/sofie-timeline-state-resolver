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
	asLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: {
			mappingType: MappingVindralComposerType.AudioSource,
			audioSourceId: 'as-guid',
			audioSourceName: 'AudioSource1',
		},
	},
	ovLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: {
			mappingType: MappingVindralComposerType.SwitcherOverlay,
			switcherId: 'sw-123',
			overlay: 2,
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
			switcherOverlays: {},
			mediaPlayers: {},
			htmlRenderers: {},
			audioSources: {},
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
			switcherOverlays: {},
			mediaPlayers: {},
			htmlRenderers: {},
			audioSources: {},
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
			switcherOverlays: {},
			mediaPlayers: {},
			htmlRenderers: {},
			audioSources: {},
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
			switcherOverlays: {},
			mediaPlayers: {},
			htmlRenderers: {},
			audioSources: {},
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

	test('media player — lookaheadOffset is ignored for a non-lookahead object', () => {
		const obj = makeDeviceTimelineStateObject({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'mpLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: { sourceUrl: 'http://cdn.example.com/clip.mp4', inTime: 1000, outTime: 5000 },
			},
		})
		obj.lookaheadOffset = 2000

		const result = buildVindralState({ time: 0, objects: [obj] }, MAPPINGS)
		expect(result.mediaPlayers['mpLayer']).toMatchObject({ inTime: 1000, outTime: 5000 })
	})

	test('media player — lookahead object adds lookaheadOffset to inTime', () => {
		const obj = makeDeviceTimelineStateObject({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'mpLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: { sourceUrl: 'http://cdn.example.com/clip.mp4', inTime: 1000, outTime: 5000 },
			},
		})
		obj.isLookahead = true
		obj.lookaheadOffset = 2000

		const result = buildVindralState({ time: 0, objects: [obj] }, MAPPINGS)
		// inTime seeked forward by the offset, outTime unchanged
		expect(result.mediaPlayers['mpLayer']).toMatchObject({ inTime: 3000, outTime: 5000 })
	})

	test('media player — lookahead object with no content inTime falls back to lookaheadOffset', () => {
		const obj = makeDeviceTimelineStateObject({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'mpLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: { sourceUrl: 'http://cdn.example.com/clip.mp4' },
			},
		})
		obj.isLookahead = true
		obj.lookaheadOffset = 2000

		const result = buildVindralState({ time: 0, objects: [obj] }, MAPPINGS)
		expect(result.mediaPlayers['mpLayer']).toMatchObject({ inTime: 2000 })
	})

	test('media player — lookahead object without lookaheadOffset leaves inTime unchanged', () => {
		const obj = makeDeviceTimelineStateObject({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'mpLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: { sourceUrl: 'http://cdn.example.com/clip.mp4', inTime: 1000 },
			},
		})
		obj.isLookahead = true

		const result = buildVindralState({ time: 0, objects: [obj] }, MAPPINGS)
		expect(result.mediaPlayers['mpLayer']).toMatchObject({ inTime: 1000 })
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

	test('html mapping — two objects merge (later fields win over undefined)', () => {
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
							html: { url: 'https://example.com', running: true },
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj1',
						layer: 'htmlLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.HTML,
							html: { reloadKey: 42 },
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
			reloadKey: 42,
			timelineObjIds: ['obj0', 'obj1'],
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

	// ── Audio Sources ─────────────────────────────────────────────────────────

	test('audio-source mapping — all fields with ID selector', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'asLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.AUDIO_SOURCE,
							audioSource: { stereoGainDb: -6, pan: 50, mute: false },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.audioSources['as-guid']).toStrictEqual({
			selector: { target: 'as-guid' },
			stereoGainDb: -6,
			pan: 50,
			mute: false,
			timelineObjIds: ['obj0'],
		})
		expect(result.mediaPlayers).toStrictEqual({})
	})

	test('audio-source mapping — selector falls back to name when no ID', () => {
		const nameOnlyMappings: Mappings<SomeMappingVindralComposer> = {
			...MAPPINGS,
			asLayer: {
				device: DeviceType.VINDRAL_COMPOSER,
				deviceId: 'vc0',
				options: {
					mappingType: MappingVindralComposerType.AudioSource,
					audioSourceName: 'AudioSource1',
				},
			},
		}
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'asLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.AUDIO_SOURCE,
							audioSource: { mute: true },
						},
					}),
				],
			},
			nameOnlyMappings
		)
		expect(result.audioSources['AudioSource1']).toMatchObject({
			selector: { targetName: 'AudioSource1' },
			mute: true,
		})
	})

	test('audio-source mapping — two objects merge (later fields win over undefined)', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'asLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.AUDIO_SOURCE,
							audioSource: { stereoGainDb: -6, pan: 50 },
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj1',
						layer: 'asLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.AUDIO_SOURCE,
							audioSource: { mute: true },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.audioSources['as-guid']).toStrictEqual({
			selector: { target: 'as-guid' },
			stereoGainDb: -6,
			pan: 50,
			mute: true,
			timelineObjIds: ['obj0', 'obj1'],
		})
	})

	test('audio-source with wrong content type is ignored', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'asLayer',
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
		expect(result.audioSources['as-guid']).toBeUndefined()
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

	// ── Switcher Overlays ─────────────────────────────────────────────────────

	test('switcher-overlay mapping — all fields with ID selector', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { inputName: 'cam2', show: true },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.switcherOverlays['sw-123/2']).toStrictEqual({
			selector: { target: 'sw-123' },
			overlayNumber: 2,
			inputName: 'cam2',
			show: true,
			timelineObjIds: ['obj0'],
		})
		expect(result.switchers).toStrictEqual({})
	})

	test('switcher-overlay mapping — partial fields (only show)', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { show: false },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.switcherOverlays['sw-123/2']).toMatchObject({
			selector: { target: 'sw-123' },
			overlayNumber: 2,
			inputName: undefined,
			show: false,
		})
	})

	test('switcher-overlay mapping — name selector', () => {
		const nameOnlyMappings: Mappings<SomeMappingVindralComposer> = {
			...MAPPINGS,
			ovLayer: {
				device: DeviceType.VINDRAL_COMPOSER,
				deviceId: 'vc0',
				options: { mappingType: MappingVindralComposerType.SwitcherOverlay, switcherName: 'MySwitcher', overlay: 3 },
			},
		}
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { inputName: 'cam5', show: true },
						},
					}),
				],
			},
			nameOnlyMappings
		)
		expect(result.switcherOverlays['MySwitcher/3']).toMatchObject({
			selector: { targetName: 'MySwitcher' },
			overlayNumber: 3,
			inputName: 'cam5',
			show: true,
		})
	})

	test('switcher-overlay mapping — two different slots on same switcher get separate state keys', () => {
		const twoSlotMappings: Mappings<SomeMappingVindralComposer> = {
			...MAPPINGS,
			ovLayer2: {
				device: DeviceType.VINDRAL_COMPOSER,
				deviceId: 'vc0',
				options: { mappingType: MappingVindralComposerType.SwitcherOverlay, switcherId: 'sw-123', overlay: 4 },
			},
		}
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { inputName: 'cam1', show: true },
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj1',
						layer: 'ovLayer2',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { inputName: 'cam4', show: false },
						},
					}),
				],
			},
			twoSlotMappings
		)
		expect(result.switcherOverlays['sw-123/2']).toMatchObject({ overlayNumber: 2, inputName: 'cam1', show: true })
		expect(result.switcherOverlays['sw-123/4']).toMatchObject({ overlayNumber: 4, inputName: 'cam4', show: false })
	})

	test('switcher-overlay with wrong content type is ignored', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
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
		expect(result.switcherOverlays['sw-123/2']).toBeUndefined()
	})
})
