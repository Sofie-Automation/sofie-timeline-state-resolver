import {
	DeviceType,
	Mappings,
	MappingVindralComposerType,
	SomeMappingVindralComposer,
	TimelineContentTypeVindralComposer,
	VindralComposerPlaybackEndCondition,
} from 'timeline-state-resolver-types'
import { buildVindralState, VindralComposerDeviceState } from '../stateBuilder.js'
import { diffVindralStates } from '../diffState.js'
import { makeDeviceTimelineStateObject } from '../../../__mocks__/objects.js'
import { EMPTY_STATE } from './lib.js'
import { VindralCommandWithContext } from '../commands.js'

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

function compareStates(
	mappings: Mappings<SomeMappingVindralComposer>,
	oldState: VindralComposerDeviceState | undefined,
	newState: VindralComposerDeviceState,
	expectedCommands: VindralCommandWithContext[]
): void {
	const commands = diffVindralStates(oldState, newState, mappings)
	expect(commands).toStrictEqual(expectedCommands)
}

function makeState(
	objects: Parameters<typeof makeDeviceTimelineStateObject>[0][],
	time = 0
): VindralComposerDeviceState {
	return buildVindralState({ time, objects: objects.map(makeDeviceTimelineStateObject) }, MAPPINGS)
}

describe('diffState', () => {
	test('undefined old state → empty new state: no commands', () => {
		compareStates(MAPPINGS, undefined, { ...EMPTY_STATE, stateTime: 0 }, [])
	})

	test('empty → empty: no commands', () => {
		const s = { ...EMPTY_STATE, stateTime: 0 }
		compareStates(MAPPINGS, s, s, [])
	})

	// ── Connectors ────────────────────────────────────────────────────────────

	describe('connectors', () => {
		const connObj = (name: string) => ({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'connLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.CONNECTOR,
				connector: { name },
			} as const,
		})

		test('new connector → trigger-connector command', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([connObj('cam1')]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'trigger-connector', name: 'cam1', value: undefined, params: undefined },
				},
			])
		})

		test('unchanged connector → no command', () => {
			const s = makeState([connObj('cam1')])
			compareStates(MAPPINGS, s, s, [])
		})

		test('connector name changed → trigger-connector command', () => {
			compareStates(MAPPINGS, makeState([connObj('cam1')]), makeState([connObj('cam2')]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'trigger-connector', name: 'cam2', value: undefined, params: undefined },
				},
			])
		})

		test('connector removed → no command', () => {
			compareStates(MAPPINGS, makeState([connObj('cam1')]), { ...EMPTY_STATE, stateTime: 0 }, [])
		})

		test('trigger by value', () => {
			compareStates(
				MAPPINGS,
				{ ...EMPTY_STATE, stateTime: 0 },
				makeState([
					{
						enable: { start: 0 },
						id: 'obj0',
						layer: 'connLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.CONNECTOR,
							connector: { value: 'myval', params: { key: 'v' } },
						} as const,
					},
				]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'trigger-connector', name: undefined, value: 'myval', params: { key: 'v' } },
					},
				]
			)
		})
	})

	// ── Scene Layers ───────────────────────────────────────────────────────────

	describe('scene layers', () => {
		const slObj = (source: string) => ({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'slLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.SCENE_LAYER,
				sceneLayer: { source },
			} as const,
		})

		test('new scene layer → set-layer-source command', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([slObj('camera-1')]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-layer-source', scene: 'main', layer: 'bg', source: 'camera-1' },
				},
			])
		})

		test('unchanged scene layer → no command', () => {
			const s = makeState([slObj('camera-1')])
			compareStates(MAPPINGS, s, s, [])
		})

		test('source changed → set-layer-source command', () => {
			compareStates(MAPPINGS, makeState([slObj('camera-1')]), makeState([slObj('camera-2')]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-layer-source', scene: 'main', layer: 'bg', source: 'camera-2' },
				},
			])
		})

		test('scene layer removed → no command', () => {
			compareStates(MAPPINGS, makeState([slObj('camera-1')]), { ...EMPTY_STATE, stateTime: 0 }, [])
		})
	})

	// ── Script Engines ─────────────────────────────────────────────────────────

	describe('script engines', () => {
		const seObj = (parameter?: Record<string, unknown>) => ({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'seLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.SCRIPT_ENGINE,
				scriptEngine: { parameter },
			} as const,
		})

		test('new script engine → execute-script command', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([seObj({ speed: 1 })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'execute-script', functionName: 'myFunc', parameter: { speed: 1 } },
				},
			])
		})

		test('unchanged script engine → no command', () => {
			const s = makeState([seObj({ speed: 1 })])
			compareStates(MAPPINGS, s, s, [])
		})

		test('parameter changed → execute-script command', () => {
			compareStates(MAPPINGS, makeState([seObj({ speed: 1 })]), makeState([seObj({ speed: 2 })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'execute-script', functionName: 'myFunc', parameter: { speed: 2 } },
				},
			])
		})

		test('script engine removed → no command', () => {
			compareStates(MAPPINGS, makeState([seObj({ speed: 1 })]), { ...EMPTY_STATE, stateTime: 0 }, [])
		})

		test('script engine with no parameter still triggers on first appearance', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([seObj(undefined)]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'execute-script', functionName: 'myFunc', parameter: undefined },
				},
			])
		})
	})

	// ── Switchers ──────────────────────────────────────────────────────────────

	describe('switchers', () => {
		const swObj = (switcher: {
			foregroundInputName?: string
			backgroundInputName?: string
			crossfadeTransitionDuration?: number
			transition?: 'cut' | 'crossfade' | null
		}) => ({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'swLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.SWITCHER,
				switcher,
			} as const,
		})

		test('new switcher with all fields → setProperty commands then invokeCommand', () => {
			const commands = diffVindralStates(
				{ ...EMPTY_STATE, stateTime: 0 },
				makeState([
					swObj({
						foregroundInputName: 'cam1',
						backgroundInputName: 'cam2',
						crossfadeTransitionDuration: 500,
						transition: 'crossfade',
					}),
				]),
				MAPPINGS
			)
			// setProperty commands must come before invokeCommand
			expect(commands).toStrictEqual([
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: { target: 'abc-123' },
						property: 'ForegroundInputName',
						value: 'cam1',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: { target: 'abc-123' },
						property: 'BackgroundInputName',
						value: 'cam2',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: { target: 'abc-123' },
						property: 'CrossfadeTransitionDuration',
						value: 500,
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: { target: 'abc-123' }, command: 'CrossfadeCommand' },
				},
			])
		})

		test('cut transition → CutCommand', () => {
			compareStates(
				MAPPINGS,
				{ ...EMPTY_STATE, stateTime: 0 },
				makeState([swObj({ backgroundInputName: 'cam2', transition: 'cut' })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: { target: 'abc-123' },
							property: 'BackgroundInputName',
							value: 'cam2',
						},
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: { target: 'abc-123' }, command: 'CutCommand' },
					},
				]
			)
		})

		test('unchanged switcher → no commands', () => {
			const s = makeState([swObj({ foregroundInputName: 'cam1', transition: 'cut' })])
			compareStates(MAPPINGS, s, s, [])
		})

		test('only property changes → setProperty commands, no invokeCommand', () => {
			compareStates(
				MAPPINGS,
				makeState([swObj({ foregroundInputName: 'cam1', transition: 'cut' })]),
				makeState([swObj({ foregroundInputName: 'cam3', transition: 'cut' })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: { target: 'abc-123' },
							property: 'ForegroundInputName',
							value: 'cam3',
						},
					},
				]
			)
		})

		test('background input change with unchanged transition type → setProperty then transition', () => {
			compareStates(
				MAPPINGS,
				makeState([swObj({ backgroundInputName: 'cam2', transition: 'crossfade' })]),
				makeState([swObj({ backgroundInputName: 'cam4', transition: 'crossfade' })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: { target: 'abc-123' },
							property: 'BackgroundInputName',
							value: 'cam4',
						},
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: { target: 'abc-123' }, command: 'CrossfadeCommand' },
					},
				]
			)
		})

		test('transition: null stages background without taking', () => {
			compareStates(
				MAPPINGS,
				{ ...EMPTY_STATE, stateTime: 0 },
				makeState([swObj({ backgroundInputName: 'cam2', transition: null })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: { target: 'abc-123' },
							property: 'BackgroundInputName',
							value: 'cam2',
						},
					},
				]
			)
		})

		test('switcher without transition → only setProperty commands', () => {
			compareStates(
				MAPPINGS,
				{ ...EMPTY_STATE, stateTime: 0 },
				makeState([swObj({ foregroundInputName: 'cam1', backgroundInputName: 'cam2' })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: { target: 'abc-123' },
							property: 'ForegroundInputName',
							value: 'cam1',
						},
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: { target: 'abc-123' },
							property: 'BackgroundInputName',
							value: 'cam2',
						},
					},
				]
			)
		})

		test('switcher removed → no commands', () => {
			compareStates(
				MAPPINGS,
				makeState([swObj({ foregroundInputName: 'cam1', transition: 'cut' })]),
				{ ...EMPTY_STATE, stateTime: 0 },
				[]
			)
		})
	})

	// ── Media Players ──────────────────────────────────────────────────────────

	describe('media players', () => {
		const mpObj = (mediaPlayer: {
			sourceUrl?: string
			inTime?: number
			outTime?: number
			playbackEndCondition?: VindralComposerPlaybackEndCondition
			autoPlay?: boolean
			playing?: boolean
		}) => ({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'mpLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer,
			} as const,
		})

		const SELECTOR = { target: 'player-guid', targetName: 'ClipPlayer1' }

		test('new media player with playing=true → properties then play-video-file-input (atomic load+play)', () => {
			const commands = diffVindralStates(
				{ ...EMPTY_STATE, stateTime: 0 },
				makeState([
					mpObj({
						sourceUrl: 'clip.mp4',
						inTime: 0,
						outTime: 5000,
						playbackEndCondition: VindralComposerPlaybackEndCondition.Loop,
						autoPlay: true,
						playing: true,
					}),
				]),
				MAPPINGS
			)
			expect(commands).toStrictEqual([
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'InTime', value: 0 },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'OutTime', value: 5000 },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: SELECTOR,
						property: 'PlayBackEndCondition',
						value: VindralComposerPlaybackEndCondition.Loop,
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'AutoPlay', value: true },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'AutoPlayOnMediaChange', value: true },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'play-video-file-input', inputName: 'ClipPlayer1', sourceUri: 'clip.mp4' },
				},
			])
		})

		test('new media player with playing=false → setProperty SourceUrl then PauseCommand', () => {
			compareStates(
				MAPPINGS,
				{ ...EMPTY_STATE, stateTime: 0 },
				makeState([mpObj({ sourceUrl: 'clip.mp4', playing: false })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'set-property', selector: SELECTOR, property: 'AutoPlayOnMediaChange', value: true },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'set-property', selector: SELECTOR, property: 'SourceUrl', value: 'clip.mp4' },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: SELECTOR, command: 'PauseCommand' },
					},
				]
			)
		})

		test('new media player without playing → setProperty SourceUrl, no invoke', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([mpObj({ sourceUrl: 'clip.mp4' })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'AutoPlayOnMediaChange', value: true },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'SourceUrl', value: 'clip.mp4' },
				},
			])
		})

		test('unchanged media player → no commands', () => {
			const s = makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })])
			compareStates(MAPPINGS, s, s, [])
		})

		test('playing clip started in the past → InTime advanced by elapsed time', () => {
			// Object started at t=0 but the state is resolved at t=3000, so a playing clip should
			// resume 3000ms past its in-point (1000 + 3000 = 4000).
			const commands = diffVindralStates(
				{ ...EMPTY_STATE, stateTime: 3000 },
				makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: true })], 3000),
				MAPPINGS
			)
			expect(commands).toStrictEqual([
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'InTime', value: 4000 },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'AutoPlayOnMediaChange', value: true },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'play-video-file-input', inputName: 'ClipPlayer1', sourceUri: 'clip.mp4' },
				},
			])
		})

		test('paused clip started in the past → InTime stays at the raw in-point (no catch-up)', () => {
			const commands = diffVindralStates(
				{ ...EMPTY_STATE, stateTime: 3000 },
				makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: false })], 3000),
				MAPPINGS
			)
			expect(commands).toStrictEqual([
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'InTime', value: 1000 },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'AutoPlayOnMediaChange', value: true },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: SELECTOR, property: 'SourceUrl', value: 'clip.mp4' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: SELECTOR, command: 'PauseCommand' },
				},
			])
		})

		test('continuing playing clip is not re-seeked when re-resolved at a later time', () => {
			// Same object (same instance start + in-point), state re-resolved 2000ms later. The
			// computed InTime drifts, but the stable anchor is unchanged so no InTime is re-sent.
			const old = makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: true })], 3000)
			const next = makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: true })], 5000)
			compareStates(MAPPINGS, old, next, [])
		})

		test('sourceUrl changed with playing=true → play-video-file-input (no separate PlayCommand)', () => {
			compareStates(
				MAPPINGS,
				makeState([mpObj({ sourceUrl: 'clip-a.mp4', playing: true })]),
				makeState([mpObj({ sourceUrl: 'clip-b.mp4', playing: true })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'play-video-file-input', inputName: 'ClipPlayer1', sourceUri: 'clip-b.mp4' },
					},
				]
			)
		})

		test('sourceUrl changed with playing=false → setProperty SourceUrl only', () => {
			compareStates(
				MAPPINGS,
				makeState([mpObj({ sourceUrl: 'clip-a.mp4', playing: false })]),
				makeState([mpObj({ sourceUrl: 'clip-b.mp4', playing: false })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'set-property', selector: SELECTOR, property: 'SourceUrl', value: 'clip-b.mp4' },
					},
				]
			)
		})

		test('sourceUrl set to empty string → StopCommand then clear-source', () => {
			compareStates(
				MAPPINGS,
				makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })]),
				makeState([mpObj({ sourceUrl: '' })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: SELECTOR, command: 'StopCommand' },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'clear-source', target: 'player-guid' },
					},
				]
			)
		})

		test('sourceUrl set to empty string → StopCommand then clear-source, no extra PauseCommand', () => {
			compareStates(
				MAPPINGS,
				makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })]),
				makeState([mpObj({ sourceUrl: '', playing: false })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: SELECTOR, command: 'StopCommand' },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'clear-source', target: 'player-guid' },
					},
				]
			)
		})

		test('playing changed to true → PlayCommand (no source change)', () => {
			compareStates(
				MAPPINGS,
				makeState([mpObj({ sourceUrl: 'clip.mp4', playing: false })]),
				makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: SELECTOR, command: 'PlayCommand' },
					},
				]
			)
		})

		test('playing changed to false → PauseCommand (no source change)', () => {
			compareStates(
				MAPPINGS,
				makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })]),
				makeState([mpObj({ sourceUrl: 'clip.mp4', playing: false })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: SELECTOR, command: 'PauseCommand' },
					},
				]
			)
		})

		test('playbackEndCondition changed → setProperty only', () => {
			compareStates(
				MAPPINGS,
				makeState([mpObj({ sourceUrl: 'clip.mp4', playbackEndCondition: VindralComposerPlaybackEndCondition.Loop })]),
				makeState([mpObj({ sourceUrl: 'clip.mp4', playbackEndCondition: VindralComposerPlaybackEndCondition.Hold })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: SELECTOR,
							property: 'PlayBackEndCondition',
							value: VindralComposerPlaybackEndCondition.Hold,
						},
					},
				]
			)
		})

		test('media player removed → no commands (no StopCommand on disappear)', () => {
			compareStates(
				MAPPINGS,
				makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })]),
				{ ...EMPTY_STATE, stateTime: 0 },
				[]
			)
		})
	})

	// ── HTML Renderers ─────────────────────────────────────────────────────────

	describe('html renderers', () => {
		const HTML_SELECTOR = { target: 'html-guid' }

		const htmlObj = (html: { url?: string; running?: boolean; reloadKey?: string | number }) => ({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'htmlLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.HTML,
				html,
			} as const,
		})

		test('new html renderer with url → StopCommand then set-property WebPageRendererUrl', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([htmlObj({ url: 'https://example.com' })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: HTML_SELECTOR,
						property: 'WebPageRendererUrl',
						value: 'https://example.com',
					},
				},
			])
		})

		test('unchanged html renderer → no commands', () => {
			const s = makeState([htmlObj({ url: 'https://example.com', running: true })])
			compareStates(MAPPINGS, s, s, [])
		})

		test('url changed → StopCommand then set-property WebPageRendererUrl', () => {
			compareStates(
				MAPPINGS,
				makeState([htmlObj({ url: 'https://old.com' })]),
				makeState([htmlObj({ url: 'https://new.com' })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: HTML_SELECTOR,
							property: 'WebPageRendererUrl',
							value: 'https://new.com',
						},
					},
				]
			)
		})

		test('running=true appears → StartCommand', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([htmlObj({ running: true })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
				},
			])
		})

		test('running=false appears → StopCommand', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([htmlObj({ running: false })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
			])
		})

		test('running true → false → StopCommand', () => {
			compareStates(MAPPINGS, makeState([htmlObj({ running: true })]), makeState([htmlObj({ running: false })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
			])
		})

		test('running false → true → StartCommand', () => {
			compareStates(MAPPINGS, makeState([htmlObj({ running: false })]), makeState([htmlObj({ running: true })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
				},
			])
		})

		test('reloadKey changes → ReloadCommand', () => {
			compareStates(MAPPINGS, makeState([htmlObj({ reloadKey: 1 })]), makeState([htmlObj({ reloadKey: 2 })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'ReloadCommand' },
				},
			])
		})

		test('reloadKey appears on first object → ReloadCommand', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([htmlObj({ reloadKey: 'v1' })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'ReloadCommand' },
				},
			])
		})

		test('reloadKey unchanged → no ReloadCommand', () => {
			compareStates(MAPPINGS, makeState([htmlObj({ reloadKey: 1 })]), makeState([htmlObj({ reloadKey: 1 })]), [])
		})

		test('url changed while running → StopCommand, set-property, StartCommand', () => {
			compareStates(
				MAPPINGS,
				makeState([htmlObj({ url: 'https://old.com', running: true })]),
				makeState([htmlObj({ url: 'https://new.com', running: true })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: HTML_SELECTOR,
							property: 'WebPageRendererUrl',
							value: 'https://new.com',
						},
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
					},
				]
			)
		})

		test('url changed while running + reloadKey changes → StopCommand, set-property, StartCommand (no redundant ReloadCommand)', () => {
			compareStates(
				MAPPINGS,
				makeState([htmlObj({ url: 'https://old.com', running: true, reloadKey: 1 })]),
				makeState([htmlObj({ url: 'https://new.com', running: true, reloadKey: 2 })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: HTML_SELECTOR,
							property: 'WebPageRendererUrl',
							value: 'https://new.com',
						},
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
					},
				]
			)
		})

		test('url changed while not running → StopCommand then set-property, no restart', () => {
			compareStates(
				MAPPINGS,
				makeState([htmlObj({ url: 'https://old.com', running: false })]),
				makeState([htmlObj({ url: 'https://new.com', running: false })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: HTML_SELECTOR,
							property: 'WebPageRendererUrl',
							value: 'https://new.com',
						},
					},
				]
			)
		})

		test('url changed + running true→false → StopCommand, set-property, StopCommand', () => {
			compareStates(
				MAPPINGS,
				makeState([htmlObj({ url: 'https://old.com', running: true })]),
				makeState([htmlObj({ url: 'https://new.com', running: false })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: {
							type: 'set-property',
							selector: HTML_SELECTOR,
							property: 'WebPageRendererUrl',
							value: 'https://new.com',
						},
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
					},
				]
			)
		})

		test('html renderer removed → no commands', () => {
			compareStates(
				MAPPINGS,
				makeState([htmlObj({ url: 'https://example.com', running: true })]),
				{ ...EMPTY_STATE, stateTime: 0 },
				[]
			)
		})

		test('url + running appear together → StopCommand, set-property, StartCommand (no redundant ReloadCommand)', () => {
			const commands = diffVindralStates(
				{ ...EMPTY_STATE, stateTime: 0 },
				makeState([htmlObj({ url: 'https://example.com', running: true, reloadKey: 1 })]),
				MAPPINGS
			)
			expect(commands).toStrictEqual([
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: HTML_SELECTOR,
						property: 'WebPageRendererUrl',
						value: 'https://example.com',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
				},
			])
		})
	})

	// ── Audio Sources ──────────────────────────────────────────────────────────

	describe('audio sources', () => {
		const AS_SELECTOR = { target: 'as-guid' }

		const asObj = (audioSource: { stereoGainDb?: number; pan?: number; mute?: boolean }) => ({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'asLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.AUDIO_SOURCE,
				audioSource,
			} as const,
		})

		test('stereoGainDb appears → set-property StereoGainDb', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([asObj({ stereoGainDb: -6 })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: AS_SELECTOR, property: 'StereoGainDb', value: -6 },
				},
			])
		})

		test('stereoGainDb changed → set-property StereoGainDb', () => {
			compareStates(MAPPINGS, makeState([asObj({ stereoGainDb: -6 })]), makeState([asObj({ stereoGainDb: 0 })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: AS_SELECTOR, property: 'StereoGainDb', value: 0 },
				},
			])
		})

		test('stereoGainDb unchanged → no command', () => {
			const s = makeState([asObj({ stereoGainDb: -6 })])
			compareStates(MAPPINGS, s, s, [])
		})

		test('pan appears → set-property Pan', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([asObj({ pan: 50 })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: AS_SELECTOR, property: 'Pan', value: 50 },
				},
			])
		})

		test('pan changed → set-property Pan', () => {
			compareStates(MAPPINGS, makeState([asObj({ pan: 50 })]), makeState([asObj({ pan: -50 })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: AS_SELECTOR, property: 'Pan', value: -50 },
				},
			])
		})

		test('pan unchanged → no command', () => {
			const s = makeState([asObj({ pan: 0 })])
			compareStates(MAPPINGS, s, s, [])
		})

		test('mute appears true → set-property Mute', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([asObj({ mute: true })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: AS_SELECTOR, property: 'Mute', value: true },
				},
			])
		})

		test('mute true → false → set-property Mute false', () => {
			compareStates(MAPPINGS, makeState([asObj({ mute: true })]), makeState([asObj({ mute: false })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: AS_SELECTOR, property: 'Mute', value: false },
				},
			])
		})

		test('mute unchanged → no command', () => {
			const s = makeState([asObj({ mute: true })])
			compareStates(MAPPINGS, s, s, [])
		})

		test('all three properties change → three set-property commands', () => {
			compareStates(
				MAPPINGS,
				makeState([asObj({ stereoGainDb: 0, pan: 0, mute: false })]),
				makeState([asObj({ stereoGainDb: -12, pan: 100, mute: true })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'set-property', selector: AS_SELECTOR, property: 'StereoGainDb', value: -12 },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'set-property', selector: AS_SELECTOR, property: 'Pan', value: 100 },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'set-property', selector: AS_SELECTOR, property: 'Mute', value: true },
					},
				]
			)
		})

		test('audio source removed → no commands', () => {
			compareStates(
				MAPPINGS,
				makeState([asObj({ stereoGainDb: -6, pan: 50, mute: false })]),
				{ ...EMPTY_STATE, stateTime: 0 },
				[]
			)
		})
	})

	// ── Switcher Overlays ──────────────────────────────────────────────────────

	describe('switcher overlays', () => {
		const OV_SELECTOR = { target: 'sw-123' }

		const ovObj = (switcherOverlay: { inputName?: string; show?: boolean }) => ({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'ovLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
				switcherOverlay,
			} as const,
		})

		test('inputName appears → set-property MvOverlay2', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([ovObj({ inputName: 'cam2' })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: OV_SELECTOR, property: 'MvOverlay2', value: 'cam2' },
				},
			])
		})

		test('inputName changed → set-property MvOverlay2', () => {
			compareStates(MAPPINGS, makeState([ovObj({ inputName: 'cam1' })]), makeState([ovObj({ inputName: 'cam2' })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: OV_SELECTOR, property: 'MvOverlay2', value: 'cam2' },
				},
			])
		})

		test('inputName unchanged → no command', () => {
			const s = makeState([ovObj({ inputName: 'cam1' })])
			compareStates(MAPPINGS, s, s, [])
		})

		test('show appears true → invoke Overlay2ShowCommand', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([ovObj({ show: true })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2ShowCommand' },
				},
			])
		})

		test('show appears false → invoke Overlay2HideCommand', () => {
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([ovObj({ show: false })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2HideCommand' },
				},
			])
		})

		test('show true → false → invoke Overlay2HideCommand', () => {
			compareStates(MAPPINGS, makeState([ovObj({ show: true })]), makeState([ovObj({ show: false })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2HideCommand' },
				},
			])
		})

		test('show false → true → invoke Overlay2ShowCommand', () => {
			compareStates(MAPPINGS, makeState([ovObj({ show: false })]), makeState([ovObj({ show: true })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2ShowCommand' },
				},
			])
		})

		test('show unchanged → no command', () => {
			const s = makeState([ovObj({ show: true })])
			compareStates(MAPPINGS, s, s, [])
		})

		test('inputName + show both change → set-property emitted before invoke-command', () => {
			compareStates(
				MAPPINGS,
				makeState([ovObj({ inputName: 'cam1', show: false })]),
				makeState([ovObj({ inputName: 'cam2', show: true })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'set-property', selector: OV_SELECTOR, property: 'MvOverlay2', value: 'cam2' },
					},
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2ShowCommand' },
					},
				]
			)
		})

		test('overlay number 1 → MvOverlay1 / Overlay1ShowCommand', () => {
			const slot1Mappings: Mappings<SomeMappingVindralComposer> = {
				...MAPPINGS,
				ovLayer: {
					device: DeviceType.VINDRAL_COMPOSER,
					deviceId: 'vc0',
					options: { mappingType: MappingVindralComposerType.SwitcherOverlay, switcherId: 'sw-123', overlay: 1 },
				},
			}
			const newState = buildVindralState(
				{ time: 0, objects: [makeDeviceTimelineStateObject(ovObj({ inputName: 'cam1', show: true }))] },
				slot1Mappings
			)
			compareStates(slot1Mappings, { ...EMPTY_STATE, stateTime: 0 }, newState, [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: OV_SELECTOR, property: 'MvOverlay1', value: 'cam1' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay1ShowCommand' },
				},
			])
		})

		test('overlay number 4 → MvOverlay4 / Overlay4HideCommand', () => {
			const slot4Mappings: Mappings<SomeMappingVindralComposer> = {
				...MAPPINGS,
				ovLayer: {
					device: DeviceType.VINDRAL_COMPOSER,
					deviceId: 'vc0',
					options: { mappingType: MappingVindralComposerType.SwitcherOverlay, switcherId: 'sw-123', overlay: 4 },
				},
			}
			const newState = buildVindralState(
				{ time: 0, objects: [makeDeviceTimelineStateObject(ovObj({ show: false }))] },
				slot4Mappings
			)
			compareStates(slot4Mappings, { ...EMPTY_STATE, stateTime: 0 }, newState, [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay4HideCommand' },
				},
			])
		})

		test('overlay removed → no commands', () => {
			compareStates(
				MAPPINGS,
				makeState([ovObj({ inputName: 'cam1', show: true })]),
				{ ...EMPTY_STATE, stateTime: 0 },
				[]
			)
		})
	})
})
