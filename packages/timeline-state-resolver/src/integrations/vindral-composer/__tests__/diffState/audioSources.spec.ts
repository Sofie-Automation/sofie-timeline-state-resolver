import { DeviceType, TimelineContentTypeVindralComposer } from 'timeline-state-resolver-types'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates, makeState } from './helpers.js'

describe('diffState — audio sources', () => {
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
