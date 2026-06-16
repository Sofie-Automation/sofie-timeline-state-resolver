import type { SomeMappingVindralComposer, Mappings } from 'timeline-state-resolver-types'
import { isEqual } from 'underscore'
import { buildVindralState, type VindralComposerDeviceState, type VindralMediaPlayerState } from './stateBuilder.js'
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
	commands.push(...diffSwitcherOverlays(resolvedOld, newState))
	commands.push(...diffMediaPlayers(resolvedOld, newState))
	commands.push(...diffHtmlRenderers(resolvedOld, newState))
	commands.push(...diffAudioSources(resolvedOld, newState))

	return commands
}

// Switchers: setProperty commands are emitted first (before invokeCommand) so inputs and duration
// are applied on the device before the transition fires. The transition is a "take" that commits
// the staged background (preview) input to program, so it fires whenever the background input
// changes — not when the transition type string changes.
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

		// Fire the transition whenever the background (preview) input changes — comparing the
		// transition string would miss repeated takes that reuse the same transition type. A
		// null/absent transition stages the background without taking.
		if (
			next.transition &&
			next.backgroundInputName !== undefined &&
			old?.backgroundInputName !== next.backgroundInputName
		) {
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

// Switcher overlays: set MvOverlay{N} property before invoking show/hide command so the
// input is applied on the device before the overlay visibility changes.
function diffSwitcherOverlays(
	oldState: VindralComposerDeviceState,
	newState: VindralComposerDeviceState
): VindralCommandWithContext[] {
	const commands: VindralCommandWithContext[] = []

	for (const key of allKeys(oldState.switcherOverlays, newState.switcherOverlays)) {
		const old = oldState.switcherOverlays[key]
		const next = newState.switcherOverlays[key]
		if (!next) continue

		const timelineObjId = next.timelineObjIds.join(' & ')
		const context = `switcher-overlay layer=${key}`
		const n = next.overlayNumber

		if (next.inputName !== undefined && old?.inputName !== next.inputName) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'set-property',
					selector: next.selector,
					property: `MvOverlay${n}`,
					value: next.inputName,
				},
			})
		}
		if (next.show !== undefined && old?.show !== next.show) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'invoke-command',
					selector: next.selector,
					command: next.show ? `Overlay${n}ShowCommand` : `Overlay${n}HideCommand`,
				},
			})
		}
	}

	return commands
}

// Media players: setProperty commands first so InTime, OutTime etc. are applied before
// SourceUrl is set and before any play/pause command fires.
// When sourceUrl is set to '' the sequence is: StopCommand (stops playback), then
// clear-source (/api/source/clear?target=<guid>) to fully clear the player. The clear
// is skipped when no target GUID is available on the selector. Neither command is sent
// on object disappear — only on an explicit empty-string sourceUrl.
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

		// Resolve the in-point to seek to, advancing a playing clip by how long its object has
		// already been live so a clip started partway through resumes from the right position.
		// Gate re-sends on the stable anchor (raw inTime + instance start), not the computed
		// value, so a continuing clip is not re-seeked on every state re-resolve.
		const nextInTime = resolveInTime(next, newState.stateTime)
		const inTimeAnchorChanged = old?.inTime !== next.inTime || old?.instanceStartTime !== next.instanceStartTime
		if (nextInTime !== undefined && inTimeAnchorChanged) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'InTime', value: nextInTime },
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
				// Empty string signals "stop and clear the player". Issue StopCommand first to
				// halt playback, then clear-source to fully clear the player via the dedicated
				// HTTP endpoint. The playing field is intentionally ignored here.
				commands.push({
					timelineObjId,
					context,
					command: { type: 'invoke-command', selector: next.selector, command: 'StopCommand' },
				})
				if (next.selector.target) {
					commands.push({
						timelineObjId,
						context,
						command: { type: 'clear-source', target: next.selector.target },
					})
				}
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

// Resolve the InTime to send for a media player. A clip that is playing is advanced by how
// long its timeline object has already been live (now - instance start), so a clip started
// partway through resumes from the correct position rather than restarting at its in-point.
// A paused/loading clip sits at its raw in-point. Lookahead objects have a future start, so
// the elapsed term is 0 and only the (already folded in) lookahead offset applies.
function resolveInTime(mp: VindralMediaPlayerState, stateTime: number): number | undefined {
	const elapsed = mp.playing === true ? Math.max(0, stateTime - mp.instanceStartTime) : 0
	if (mp.inTime === undefined) return elapsed > 0 ? elapsed : undefined
	return mp.inTime + elapsed
}

// HTML renderers: set property before invoking commands so the URL is applied before
// Start/Stop/Reload fires. No cleanup on disappear — fire-and-forget like connectors.
// When the URL changes while the renderer is already running, a Stop→setUrl→Start cycle
// is required — Composer ignores WebPageRendererUrl changes on the non-WebGL variants
// while the renderer is active.
function diffHtmlRenderers(
	oldState: VindralComposerDeviceState,
	newState: VindralComposerDeviceState
): VindralCommandWithContext[] {
	const commands: VindralCommandWithContext[] = []

	for (const key of allKeys(oldState.htmlRenderers, newState.htmlRenderers)) {
		const old = oldState.htmlRenderers[key]
		const next = newState.htmlRenderers[key]
		if (!next) continue

		const timelineObjId = next.timelineObjIds.join(' & ')
		const context = `html-renderer key=${key}`

		const nextUrl = next.url
		const urlChanged = nextUrl !== undefined && old?.url !== nextUrl

		if (urlChanged) {
			commands.push(
				{
					// Stop before setting the URL — Composer ignores WebPageRendererUrl changes while running.
					timelineObjId,
					context,
					command: { type: 'invoke-command', selector: next.selector, command: 'StopCommand' },
				},
				{
					timelineObjId,
					context,
					command: {
						type: 'set-property',
						selector: next.selector,
						property: 'WebPageRendererUrl',
						value: nextUrl,
					},
				}
			)
		}

		const runningChanged = next.running !== undefined && old?.running !== next.running
		if (runningChanged) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'invoke-command',
					selector: next.selector,
					command: next.running ? 'StartCommand' : 'StopCommand',
				},
			})
		} else if (urlChanged && next.running === true) {
			// URL change forced a stop above; restart since the desired state is still running.
			commands.push({
				timelineObjId,
				context,
				command: { type: 'invoke-command', selector: next.selector, command: 'StartCommand' },
			})
		}

		if (!urlChanged && next.reloadKey !== undefined && old?.reloadKey !== next.reloadKey) {
			commands.push({
				timelineObjId,
				context,
				command: {
					type: 'invoke-command',
					selector: next.selector,
					command: 'ReloadCommand',
				},
			})
		}
	}

	return commands
}

function diffAudioSources(
	oldState: VindralComposerDeviceState,
	newState: VindralComposerDeviceState
): VindralCommandWithContext[] {
	const commands: VindralCommandWithContext[] = []

	for (const key of allKeys(oldState.audioSources, newState.audioSources)) {
		const old = oldState.audioSources[key]
		const next = newState.audioSources[key]
		if (!next) continue

		const timelineObjId = next.timelineObjIds.join(' & ')
		const context = `audio-source key=${key}`

		if (next.stereoGainDb !== undefined && old?.stereoGainDb !== next.stereoGainDb) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'StereoGainDb', value: next.stereoGainDb },
			})
		}
		if (next.pan !== undefined && old?.pan !== next.pan) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'Pan', value: next.pan },
			})
		}
		if (next.mute !== undefined && old?.mute !== next.mute) {
			commands.push({
				timelineObjId,
				context,
				command: { type: 'set-property', selector: next.selector, property: 'Mute', value: next.mute },
			})
		}
	}

	return commands
}

function allKeys<V>(a: Record<string, V | undefined>, b: Record<string, V | undefined>): string[] {
	return [...new Set([...Object.keys(a), ...Object.keys(b)])]
}
