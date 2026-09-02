import { Mappings, SomeMappingVindralComposer } from 'timeline-state-resolver-types'
import { buildVindralState, VindralComposerDeviceState } from '../../stateBuilder.js'
import { diffVindralStates as diffVindralStatesImpl } from '../../diffState.js'
import { makeDeviceTimelineStateObject } from '../../../../__mocks__/objects.js'
import { VindralCommandWithContext } from '../../commands.js'
import { MAPPINGS } from '../lib.js'

// The production diffVindralStates requires useScriptEngine. Default it here so the many call sites
// below stay terse; tests that care pass it explicitly.
export function diffVindralStates(
	oldState: VindralComposerDeviceState | undefined,
	newState: VindralComposerDeviceState,
	mappings: Mappings<SomeMappingVindralComposer>,
	useScriptEngine = false
): VindralCommandWithContext[] {
	return diffVindralStatesImpl(oldState, newState, mappings, useScriptEngine)
}

export function compareStates(
	mappings: Mappings<SomeMappingVindralComposer>,
	oldState: VindralComposerDeviceState | undefined,
	newState: VindralComposerDeviceState,
	expectedCommands: VindralCommandWithContext[]
): void {
	const commands = diffVindralStates(oldState, newState, mappings)
	expect(commands).toStrictEqual(expectedCommands)
}

export function makeState(
	objects: Parameters<typeof makeDeviceTimelineStateObject>[0][],
	time = 0
): VindralComposerDeviceState {
	return buildVindralState({ time, objects: objects.map(makeDeviceTimelineStateObject) }, MAPPINGS)
}
