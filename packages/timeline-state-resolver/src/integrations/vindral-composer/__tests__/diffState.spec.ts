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
			transition?: 'cut' | 'crossfade'
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
			compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([swObj({ transition: 'cut' })]), [
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: { target: 'abc-123' }, command: 'CutCommand' },
				},
			])
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

		test('transition type change → invokeCommand only (property unchanged)', () => {
			compareStates(
				MAPPINGS,
				makeState([swObj({ foregroundInputName: 'cam1', transition: 'cut' })]),
				makeState([swObj({ foregroundInputName: 'cam1', transition: 'crossfade' })]),
				[
					{
						timelineObjId: 'obj0',
						context: expect.any(String),
						command: { type: 'invoke-command', selector: { target: 'abc-123' }, command: 'CrossfadeCommand' },
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
})
