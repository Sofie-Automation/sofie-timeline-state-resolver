import type { SomeMappingVindralComposer, Mappings } from 'timeline-state-resolver-types'
import { isEqual } from 'underscore'
import { buildVindralState, type VindralComposerDeviceState } from './stateBuilder.js'
import type { VindralCommandWithContext } from './commands.js'

export function diffVindralStates(
	oldState: VindralComposerDeviceState | undefined,
	newState: VindralComposerDeviceState,
	mappings: Mappings<SomeMappingVindralComposer>
): VindralCommandWithContext[] {
	const resolvedOld = oldState ?? buildVindralState({ time: 0, objects: [] }, mappings)
	const commands: VindralCommandWithContext[] = []

	// Connectors: trigger whenever content appears or changes
	for (const key of allKeys(resolvedOld.connectors, newState.connectors)) {
		const old = resolvedOld.connectors[key]
		const next = newState.connectors[key]
		if (next && (old?.name !== next.name || old?.value !== next.value || !isEqual(old?.params, next.params))) {
			commands.push({
				timelineObjId: next.timelineObjIds.join(' & '),
				context: `connector layer=${key}`,
				command: { type: 'trigger-connector', name: next.name, value: next.value, params: next.params },
			})
		}
	}

	// Scene layers: update source when it appears or changes
	for (const key of allKeys(resolvedOld.sceneLayers, newState.sceneLayers)) {
		const old = resolvedOld.sceneLayers[key]
		const next = newState.sceneLayers[key]
		if (next && old?.source !== next.source) {
			commands.push({
				timelineObjId: next.timelineObjIds.join(' & '),
				context: `scene-layer key=${key}`,
				command: { type: 'set-layer-source', scene: next.scene, layer: next.layer, source: next.source },
			})
		}
	}

	// Script engines: execute whenever content appears or changes
	for (const key of allKeys(resolvedOld.scriptEngines, newState.scriptEngines)) {
		const old = resolvedOld.scriptEngines[key]
		const next = newState.scriptEngines[key]
		if (next && (old?.functionName !== next.functionName || !isEqual(old?.parameter, next.parameter))) {
			commands.push({
				timelineObjId: next.timelineObjIds.join(' & '),
				context: `script-engine function=${key}`,
				command: { type: 'execute-script', functionName: next.functionName, parameter: next.parameter },
			})
		}
	}

	return commands
}

function allKeys<V>(a: Record<string, V | undefined>, b: Record<string, V | undefined>): string[] {
	return [...new Set([...Object.keys(a), ...Object.keys(b)])]
}
