import {
	DeviceType,
	MappingVindralComposerType,
	type Mappings,
	type SomeMappingVindralComposer,
	TimelineContentTypeVindralComposer,
} from 'timeline-state-resolver-types'
import { buildVindralState, type VindralComposerDeviceState } from '../stateBuilder.js'
import { diffVindralStates } from '../diffState.js'
import { makeDeviceTimelineStateObject } from '../../../__mocks__/objects.js'
import { EMPTY_STATE } from './lib.js'
import type { VindralCommandWithContext } from '../commands.js'

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
})
