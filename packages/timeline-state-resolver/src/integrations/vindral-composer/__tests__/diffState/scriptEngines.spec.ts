import { DeviceType, TimelineContentTypeVindralComposer } from 'timeline-state-resolver-types'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates, makeState } from './helpers.js'

describe('diffState — script engines', () => {
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
