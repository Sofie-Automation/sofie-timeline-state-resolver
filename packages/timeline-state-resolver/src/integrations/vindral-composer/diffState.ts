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

	commands.push(...diffSwitchers(resolvedOld, newState))
	commands.push(...diffMediaPlayers(resolvedOld, newState))

	return commands
}

// Switchers: setProperty commands are emitted first (before invokeCommand) so inputs and duration
// are applied on the device before the transition fires.
function diffSwitchers(
	oldState: VindralComposerDeviceState,
	newState: VindralComposerDeviceState
): VindralCommandWithContext[] {
	const commands: VindralCommandWithContext[] = []

	for (const key of allKeys(oldState.switchers, newState.switchers)) {
		const old = oldState.switchers[key]
		const next = newState.switchers[key]
		if (!next) continue

		const timelineObjId = next.timelineObjIds.join(' & ')
		const context = `switcher layer=${key}`

		if (next.foregroundInputName !== undefined && old?.foregroundInputName !== next.foregroundInputName) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'set-property',
					selector: next.selector,
					property: 'ForegroundInputName',
					value: next.foregroundInputName,
				},
			})
		}
		if (next.backgroundInputName !== undefined && old?.backgroundInputName !== next.backgroundInputName) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'set-property',
					selector: next.selector,
					property: 'BackgroundInputName',
					value: next.backgroundInputName,
				},
			})
		}
		if (
			next.crossfadeTransitionDuration !== undefined &&
			old?.crossfadeTransitionDuration !== next.crossfadeTransitionDuration
		) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'set-property',
					selector: next.selector,
					property: 'CrossfadeTransitionDuration',
					value: next.crossfadeTransitionDuration,
				},
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

// Media players: setProperty commands first so InTime, OutTime etc. are applied before
// SourceUrl is set and before any play/pause command fires.
// StopCommand is only sent when sourceUrl is explicitly set to '' — it stops playback
// and clears the player to black. It is intentionally NOT sent on object disappear.
function diffMediaPlayers(
	oldState: VindralComposerDeviceState,
	newState: VindralComposerDeviceState
): VindralCommandWithContext[] {
	const commands: VindralCommandWithContext[] = []

	for (const key of allKeys(oldState.mediaPlayers, newState.mediaPlayers)) {
		const old = oldState.mediaPlayers[key]
		const next = newState.mediaPlayers[key]
		if (!next) continue

		const timelineObjId = next.timelineObjIds.join(' & ')
		const context = `media-player layer=${key}`

		if (next.inTime !== undefined && old?.inTime !== next.inTime) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'InTime', value: next.inTime },
			})
		}
		if (next.outTime !== undefined && old?.outTime !== next.outTime) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'OutTime', value: next.outTime },
			})
		}
		if (next.playbackEndCondition !== undefined && old?.playbackEndCondition !== next.playbackEndCondition) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'set-property',
					selector: next.selector,
					property: 'PlayBackEndCondition',
					value: next.playbackEndCondition,
				},
			})
		}
		if (next.autoPlay !== undefined && old?.autoPlay !== next.autoPlay) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'AutoPlay', value: next.autoPlay },
			})
		}
		if (next.autoPlayOnMediaChange !== undefined && old?.autoPlayOnMediaChange !== next.autoPlayOnMediaChange) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'set-property',
					selector: next.selector,
					property: 'AutoPlayOnMediaChange',
					value: next.autoPlayOnMediaChange,
				},
			})
		}

		const nextSourceUrl = next.sourceUrl
		const sourceChanged = nextSourceUrl !== undefined && old?.sourceUrl !== nextSourceUrl
		let usedPlayVideoFileInput = false

		if (sourceChanged) {
			if (nextSourceUrl === '') {
				// Empty string signals "stop and clear the player". StopCommand stops playback
				// and clears to black — the playing field is intentionally ignored here.
				commands.push({
					timelineObjId,
					context,
					command: { type: 'invoke-command', selector: next.selector, command: 'StopCommand' },
				})
			} else if (next.playing === true) {
				// Both mediaPlayerId and mediaPlayerName are required on the mapping, so
				// targetName is always available here. Use the atomic load-and-play endpoint
				// so the device handles clip-load timing before starting playback.
				commands.push({
					timelineObjId,
					context,
					command: { type: 'play-video-file-input', inputName: next.selector.targetName!, sourceUri: nextSourceUrl },
				})
				usedPlayVideoFileInput = true
			} else {
				commands.push({
					timelineObjId,
					context,
					command: { type: 'set-property', selector: next.selector, property: 'SourceUrl', value: nextSourceUrl },
				})
			}
		}

		// Skip play/pause when StopCommand or play-video-file-input already covers it.
		if (!usedPlayVideoFileInput && (nextSourceUrl !== '' || !sourceChanged)) {
			if (next.playing !== undefined && old?.playing !== next.playing) {
				commands.push({
					timelineObjId,
					context,
					command: {
						type: 'invoke-command',
						selector: next.selector,
						command: next.playing ? 'PlayCommand' : 'PauseCommand',
					},
				})
			}
		}
	}

	return commands
}

function allKeys<V>(a: Record<string, V | undefined>, b: Record<string, V | undefined>): string[] {
	return [...new Set([...Object.keys(a), ...Object.keys(b)])]
}
