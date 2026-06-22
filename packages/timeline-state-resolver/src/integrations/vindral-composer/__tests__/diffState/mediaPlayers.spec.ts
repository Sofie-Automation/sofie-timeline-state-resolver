import {
	DeviceType,
	TimelineContentTypeVindralComposer,
	VindralComposerPlaybackEndBehaviour,
} from 'timeline-state-resolver-types'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates, diffVindralStates, makeState } from './helpers.js'

describe('diffState — media players', () => {
	const mpObj = (mediaPlayer: {
		sourceUrl?: string
		inTime?: number
		outTime?: number
		endBehaviour?: VindralComposerPlaybackEndBehaviour
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
		// in/out points are not applied by the direct flow (only the script engine can seek), so
		// no InTime/OutTime commands are emitted here.
		const commands = diffVindralStates(
			{ ...EMPTY_STATE, stateTime: 0 },
			makeState([
				mpObj({
					sourceUrl: 'clip.mp4',
					inTime: 0,
					outTime: 5000,
					endBehaviour: VindralComposerPlaybackEndBehaviour.Loop,
					playing: true,
				}),
			]),
			MAPPINGS
		)
		expect(commands).toStrictEqual([
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: {
					type: 'set-property',
					selector: SELECTOR,
					property: 'PlayBackEndCondition',
					value: VindralComposerPlaybackEndBehaviour.Loop,
				},
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

	test('playing clip with inTime → inTime ignored (no InTime command), warning logged', () => {
		// The direct flow cannot seek, so a specified inTime produces no InTime command — just a
		// warning — and the clip loads + plays from its natural start.
		const logWarning = jest.fn()
		const commands = diffVindralStates(
			{ ...EMPTY_STATE, stateTime: 3000 },
			makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: true })], 3000),
			MAPPINGS,
			false,
			logWarning
		)
		expect(commands).toStrictEqual([
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
		expect(logWarning).toHaveBeenCalledWith(expect.stringContaining('inTime=1000'))
	})

	test('paused clip with inTime → inTime ignored (no InTime command)', () => {
		const commands = diffVindralStates(
			{ ...EMPTY_STATE, stateTime: 3000 },
			makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: false })], 3000),
			MAPPINGS
		)
		expect(commands).toStrictEqual([
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

	test('endBehaviour changed → setProperty only', () => {
		compareStates(
			MAPPINGS,
			makeState([mpObj({ sourceUrl: 'clip.mp4', endBehaviour: VindralComposerPlaybackEndBehaviour.Loop })]),
			makeState([mpObj({ sourceUrl: 'clip.mp4', endBehaviour: VindralComposerPlaybackEndBehaviour.Hold })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: SELECTOR,
						property: 'PlayBackEndCondition',
						value: VindralComposerPlaybackEndBehaviour.Hold,
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
