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

	// Switchers: setProperty commands are emitted first (before invokeCommand) so inputs and duration
	// are applied on the device before the transition fires.
	for (const key of allKeys(resolvedOld.switchers, newState.switchers)) {
		const old = resolvedOld.switchers[key]
		const next = newState.switchers[key]
		if (!next) continue

		const timelineObjId = next.timelineObjIds.join(' & ')
		const context = `switcher layer=${key}`

		if (next.foregroundInputName !== undefined && old?.foregroundInputName !== next.foregroundInputName) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'ForegroundInputName', value: next.foregroundInputName },
			})
		}
		if (next.backgroundInputName !== undefined && old?.backgroundInputName !== next.backgroundInputName) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'BackgroundInputName', value: next.backgroundInputName },
			})
		}
		if (next.crossfadeTransitionDuration !== undefined && old?.crossfadeTransitionDuration !== next.crossfadeTransitionDuration) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'CrossfadeTransitionDuration', value: next.crossfadeTransitionDuration },
			})
		}

		if (next.transition !== undefined && old?.transition !== next.transition) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'invoke-command',
					selector: next.selector,
					command: next.transition === 'cut' ? 'CutCommand' : 'CrossfadeCommand',
				},
			})
		}
	}

	return commands
}

function allKeys<V>(a: Record<string, V | undefined>, b: Record<string, V | undefined>): string[] {
	return [...new Set([...Object.keys(a), ...Object.keys(b)])]
}
