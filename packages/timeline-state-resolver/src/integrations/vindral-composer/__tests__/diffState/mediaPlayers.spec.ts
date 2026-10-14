import {
	DeviceType,
	TimelineContentTypeVindralComposer,
	VindralComposerPlaybackEndBehaviour,
} from 'timeline-state-resolver-types'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates, diffVindralStates, makeState } from './helpers.js'
import { VindralComposerDeviceState } from '../../stateBuilder.js'

describe('diffState — media players', () => {
	const mpObj = (
		mediaPlayer: {
			sourceUrl?: string
			inTime?: number
			outTime?: number
			endBehaviour?: VindralComposerPlaybackEndBehaviour
			playing?: boolean
		},
		startTime: number = 0
	) => ({
		enable: { start: startTime },
		id: 'obj0',
		layer: 'mpLayer',
		content: {
			deviceType: DeviceType.VINDRAL_COMPOSER,
			type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
			mediaPlayer,
		} as const,
	})

	const SELECTOR = { target: 'player-guid', targetName: 'ClipPlayer1' }

	test('new media player with playing=true → properties then play', () => {
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
				command: { type: 'update-media', selector: SELECTOR, sourceUri: 'clip.mp4', inTime: 0, playing: true },
			},
		])
	})

	test('new media player with playing=false → update-media with playing=false', () => {
		compareStates(
			MAPPINGS,
			{ ...EMPTY_STATE, stateTime: 0 },
			makeState([mpObj({ sourceUrl: 'clip.mp4', playing: false })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'update-media',
						selector: SELECTOR,
						sourceUri: 'clip.mp4',
						inTime: undefined,
						playing: false,
					},
				},
			]
		)
	})

	test('new media player without playing → defaults to playing', () => {
		// Playing defaults to true when omitted.
		compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([mpObj({ sourceUrl: 'clip.mp4' })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'update-media', selector: SELECTOR, sourceUri: 'clip.mp4', inTime: undefined, playing: true },
			},
		])
	})

	test('unchanged media player → no commands', () => {
		const s = makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })])
		compareStates(MAPPINGS, s, s, [])
	})

	test('playing clip with inTime → inTime is carried by update-media', () => {
		const commands = diffVindralStates(
			{ ...EMPTY_STATE, stateTime: 3000 },
			makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: true }, 3000)], 3000),
			MAPPINGS
		)
		expect(commands).toStrictEqual([
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'update-media', selector: SELECTOR, sourceUri: 'clip.mp4', inTime: 1000, playing: true },
			},
		])
	})
	test('playing clip with inTime late', () => {
		/** point in time the clip started playing */
		let clipStartTime = 5000
		/** Current time */
		let stateTime = 10000

		let prevState: VindralComposerDeviceState = { ...EMPTY_STATE, stateTime: 0 }
		let currentState: VindralComposerDeviceState

		{
			// We start playing a clip "now":
			clipStartTime = 100000
			stateTime = 100000
			currentState = makeState(
				[mpObj({ sourceUrl: 'clip.mp4', inTime: 60000, playing: true }, clipStartTime)],
				stateTime
			)
			const commands = diffVindralStates(prevState, currentState, MAPPINGS)
			expect(commands).toHaveLength(1)
			expect(commands[0].command).toEqual({
				type: 'update-media',
				selector: SELECTOR,
				sourceUri: 'clip.mp4',
				inTime: 60000,
				playing: true,
			})
			prevState = currentState
		}
		{
			// Some time has passed since the clip started playing:
			stateTime = 200000
			currentState = makeState(
				[mpObj({ sourceUrl: 'clip.mp4', inTime: 60000, playing: true }, clipStartTime)],
				stateTime
			)
			const commands = diffVindralStates(prevState, currentState, MAPPINGS)
			expect(commands).toHaveLength(0) // only time has passed, so the the media player is still in sync with us.
			prevState = currentState
		}
		{
			// Recover from an empty previous state:
			prevState = { ...EMPTY_STATE, stateTime: 0 }
			const commands = diffVindralStates(prevState, currentState, MAPPINGS)
			expect(commands).toHaveLength(1)
			expect(commands[0].command).toEqual({
				type: 'update-media',
				selector: SELECTOR,
				sourceUri: 'clip.mp4',
				inTime: 160000,
				playing: true,
			})
			prevState = currentState
		}
		{
			// The inTime is modified:
			currentState = makeState(
				[mpObj({ sourceUrl: 'clip.mp4', inTime: 70000, playing: true }, clipStartTime)],
				stateTime
			)
			const commands = diffVindralStates(prevState, currentState, MAPPINGS)
			expect(commands).toHaveLength(1)
			expect(commands[0].command).toEqual({
				type: 'update-media',
				selector: SELECTOR,
				sourceUri: 'clip.mp4',
				inTime: 170000,
				playing: true,
			})
			prevState = currentState
		}
	})

	test('paused clip with inTime → update-media carries inTime and paused state', () => {
		const commands = diffVindralStates(
			{ ...EMPTY_STATE, stateTime: 3000 },
			makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: false })], 3000),
			MAPPINGS
		)
		expect(commands).toStrictEqual([
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'update-media', selector: SELECTOR, sourceUri: 'clip.mp4', inTime: 1000, playing: false },
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

	test('sourceUrl changed with playing=true → update-media starts playback', () => {
		compareStates(
			MAPPINGS,
			makeState([mpObj({ sourceUrl: 'clip-a.mp4', playing: true })]),
			makeState([mpObj({ sourceUrl: 'clip-b.mp4', playing: true })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'update-media',
						selector: SELECTOR,
						sourceUri: 'clip-b.mp4',
						inTime: undefined,
						playing: true,
					},
				},
			]
		)
	})

	test('sourceUrl changed with playing=false → update-media remains paused', () => {
		compareStates(
			MAPPINGS,
			makeState([mpObj({ sourceUrl: 'clip-a.mp4', playing: false })]),
			makeState([mpObj({ sourceUrl: 'clip-b.mp4', playing: false })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'update-media',
						selector: SELECTOR,
						sourceUri: 'clip-b.mp4',
						inTime: undefined,
						playing: false,
					},
				},
			]
		)
	})

	test('sourceUrl set to empty string → update-media clears source', () => {
		compareStates(
			MAPPINGS,
			makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })]),
			makeState([mpObj({ sourceUrl: '' })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'update-media', selector: SELECTOR, sourceUri: '', inTime: undefined, playing: false },
				},
			]
		)
	})

	test('sourceUrl set to empty string while paused → update-media clears source', () => {
		compareStates(
			MAPPINGS,
			makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })]),
			makeState([mpObj({ sourceUrl: '', playing: false })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'update-media', selector: SELECTOR, sourceUri: '', inTime: undefined, playing: false },
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
