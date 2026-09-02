import { DeviceType, TimelineContentTypeVindralComposer } from 'timeline-state-resolver-types'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates, makeState } from './helpers.js'

describe('diffState — connectors', () => {
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
