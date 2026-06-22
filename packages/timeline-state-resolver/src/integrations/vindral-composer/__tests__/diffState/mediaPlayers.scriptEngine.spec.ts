import {
	DeviceType,
	TimelineContentTypeVindralComposer,
	VindralComposerPlaybackEndBehaviour,
} from 'timeline-state-resolver-types'
import { TSR_SCRIPT_FN_MEDIA_PLAYER } from '../../constants.js'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { diffVindralStates, makeState } from './helpers.js'

describe('diffState — media players — script engine flow', () => {
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

	const scriptCommand = (parameter: Record<string, unknown>) => ({
		timelineObjId: 'obj0',
		context: expect.any(String),
		command: { type: 'execute-script', functionName: TSR_SCRIPT_FN_MEDIA_PLAYER, parameter },
	})

	test('source appears with playing=true → single tsrMediaPlayer with full desired state', () => {
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
			MAPPINGS,
			true
		)
		expect(commands).toStrictEqual([
			scriptCommand({
				name: 'ClipPlayer1',
				sourceUrl: 'clip.mp4',
				playing: true,
				inTime: 0,
				outTime: 5000,
				playbackEndCondition: VindralComposerPlaybackEndBehaviour.Loop,
				autoPlayOnMediaChange: true,
			}),
		])
	})

	test('source appears with playing=false → tsrMediaPlayer with playing=false and no inTime', () => {
		const commands = diffVindralStates(
			{ ...EMPTY_STATE, stateTime: 0 },
			makeState([mpObj({ sourceUrl: 'clip.mp4', playing: false })]),
			MAPPINGS,
			true
		)
		expect(commands).toStrictEqual([
			scriptCommand({
				name: 'ClipPlayer1',
				sourceUrl: 'clip.mp4',
				playing: false,
				autoPlayOnMediaChange: true,
			}),
		])
	})

	test('playing clip started in the past → tsrMediaPlayer carries elapsed-adjusted inTime', () => {
		const commands = diffVindralStates(
			{ ...EMPTY_STATE, stateTime: 3000 },
			makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: true })], 3000),
			MAPPINGS,
			true
		)
		expect(commands).toStrictEqual([
			scriptCommand({
				name: 'ClipPlayer1',
				sourceUrl: 'clip.mp4',
				playing: true,
				inTime: 4000,
				autoPlayOnMediaChange: true,
			}),
		])
	})

	test('source changed → single tsrMediaPlayer carrying the new source', () => {
		const commands = diffVindralStates(
			makeState([mpObj({ sourceUrl: 'clip-a.mp4', playing: true })]),
			makeState([mpObj({ sourceUrl: 'clip-b.mp4', playing: true })]),
			MAPPINGS,
			true
		)
		expect(commands).toStrictEqual([
			scriptCommand({
				name: 'ClipPlayer1',
				sourceUrl: 'clip-b.mp4',
				playing: true,
				autoPlayOnMediaChange: true,
			}),
		])
	})

	test('seek with no source change → tsrMediaPlayer with inTime and no sourceUrl', () => {
		const commands = diffVindralStates(
			makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: false })]),
			makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 2000, playing: false })]),
			MAPPINGS,
			true
		)
		expect(commands).toStrictEqual([
			scriptCommand({
				name: 'ClipPlayer1',
				playing: false,
				inTime: 2000,
				autoPlayOnMediaChange: true,
			}),
		])
	})

	test('play/pause toggle with no source change → tsrMediaPlayer with playing only (no sourceUrl)', () => {
		const commands = diffVindralStates(
			makeState([mpObj({ sourceUrl: 'clip.mp4', playing: false })]),
			makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })]),
			MAPPINGS,
			true
		)
		expect(commands).toStrictEqual([
			scriptCommand({
				name: 'ClipPlayer1',
				playing: true,
				autoPlayOnMediaChange: true,
			}),
		])
	})

	test('source set to empty string → tsrMediaPlayer with sourceUrl empty (stop + clear)', () => {
		const commands = diffVindralStates(
			makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })]),
			makeState([mpObj({ sourceUrl: '' })]),
			MAPPINGS,
			true
		)
		// playing defaults to true when omitted, so it is carried through alongside the empty source
		expect(commands).toStrictEqual([
			scriptCommand({
				name: 'ClipPlayer1',
				sourceUrl: '',
				playing: true,
				autoPlayOnMediaChange: true,
			}),
		])
	})

	test('continuing playing clip re-resolved later → no command (anchor unchanged)', () => {
		const old = makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: true })], 3000)
		const next = makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000, playing: true })], 5000)
		expect(diffVindralStates(old, next, MAPPINGS, true)).toStrictEqual([])
	})

	test('unchanged media player → no commands', () => {
		const s = makeState([mpObj({ sourceUrl: 'clip.mp4', playing: true })])
		expect(diffVindralStates(s, s, MAPPINGS, true)).toStrictEqual([])
	})
})
