import { DeviceType, TimelineContentTypeVindralComposer } from 'timeline-state-resolver-types'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates, makeState } from './helpers.js'

describe('diffState — scene layers', () => {
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
