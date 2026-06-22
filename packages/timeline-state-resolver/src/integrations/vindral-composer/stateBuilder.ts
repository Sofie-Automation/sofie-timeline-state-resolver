import {
	DeviceType,
	MappingVindralComposerType,
	TimelineContentTypeVindralComposer,
	type Mappings,
	type TSRTimelineContent,
	type SomeMappingVindralComposer,
	VindralComposerPlaybackEndBehaviour,
} from 'timeline-state-resolver-types'
import { assertNever, Complete } from '../../lib.js'
import type { DeviceTimelineState } from 'timeline-state-resolver-api'

export interface VindralComposerDeviceState {
	stateTime: number
	connectors: Record<string, VindralConnectorState | undefined>
	sceneLayers: Record<string, VindralSceneLayerState | undefined>
	scriptEngines: Record<string, VindralScriptEngineState | undefined>
	switchers: Record<string, VindralSwitcherState | undefined>
	switcherOverlays: Record<string, VindralSwitcherOverlayState | undefined>
	mediaPlayers: Record<string, VindralMediaPlayerState | undefined>
	htmlRenderers: Record<string, VindralHtmlState | undefined>
	audioSources: Record<string, VindralAudioSourceState | undefined>
}

export interface VindralMediaPlayerState {
	selector: { target?: string; targetName?: string }
	autoPlayOnMediaChange?: boolean
	sourceUrl?: string
	/** The in-point to seek to when the clip goes live (lookahead offset already folded in). */
	inTime?: number
	outTime?: number
	endBehaviour?: VindralComposerPlaybackEndBehaviour
	playing?: boolean
	/** Wall-clock start of the timeline object instance. Used to catch a playing clip up to "now". */
	instanceStartTime: number
	timelineObjIds: string[]
}

export interface VindralAudioSourceState {
	selector: { target?: string; targetName?: string }
	stereoGainDb?: number
	pan?: number
	mute?: boolean
	timelineObjIds: string[]
}

export interface VindralConnectorState {
	name?: string
	value?: string
	params?: Record<string, string>
	timelineObjIds: string[]
}

export interface VindralSceneLayerState {
	scene: string
	layer: string
	source: string
	timelineObjIds: string[]
}

export interface VindralScriptEngineState {
	functionName: string
	parameter?: Record<string, unknown>
	timelineObjIds: string[]
}

export interface VindralSwitcherState {
	selector: { target?: string; targetName?: string }
	foregroundInputName?: string
	backgroundInputName?: string
	crossfadeTransitionDuration?: number
	transition?: 'cut' | 'crossfade' | null
	timelineObjIds: string[]
}

export interface VindralSwitcherOverlayState {
	selector: { target?: string; targetName?: string }
	overlayNumber: number
	inputName?: string
	show?: boolean
	timelineObjIds: string[]
}

export interface VindralHtmlState {
	selector: { target?: string; targetName?: string }
	url?: string
	running?: boolean
	reloadKey?: string | number
	timelineObjIds: string[]
}

export function buildVindralState(
	timelineState: DeviceTimelineState<TSRTimelineContent>,
	mappings: Mappings<SomeMappingVindralComposer>
): VindralComposerDeviceState {
	const state: VindralComposerDeviceState = {
		stateTime: timelineState.time,
		connectors: {},
		sceneLayers: {},
		scriptEngines: {},
		switchers: {},
		switcherOverlays: {},
		mediaPlayers: {},
		htmlRenderers: {},
		audioSources: {},
	}

	for (const obj of timelineState.objects) {
		const layerId = String(obj.layer)
		const mapping = mappings[layerId]
		if (!mapping || mapping.device !== DeviceType.VINDRAL_COMPOSER) continue
		const content = obj.content
		if (content.deviceType !== DeviceType.VINDRAL_COMPOSER) continue

		switch (mapping.options.mappingType) {
			case MappingVindralComposerType.Connector: {
				if (content.type !== TimelineContentTypeVindralComposer.CONNECTOR) break

				state.connectors[layerId] = {
					name: content.connector.name,
					value: content.connector.value,
					params: content.connector.params,
					timelineObjIds: [obj.id],
				} satisfies Complete<VindralConnectorState>
				break
			}
			case MappingVindralComposerType.SceneLayer: {
				if (content.type !== TimelineContentTypeVindralComposer.SCENE_LAYER) break

				state.sceneLayers[`${mapping.options.scene}/${mapping.options.layer}`] = {
					scene: mapping.options.scene,
					layer: mapping.options.layer,
					source: content.sceneLayer.source,
					timelineObjIds: [obj.id],
				} satisfies Complete<VindralSceneLayerState>
				break
			}
			case MappingVindralComposerType.ScriptEngine: {
				if (content.type !== TimelineContentTypeVindralComposer.SCRIPT_ENGINE) break

				state.scriptEngines[mapping.options.functionName] = {
					functionName: mapping.options.functionName,
					parameter: content.scriptEngine.parameter,
					timelineObjIds: [obj.id],
				} satisfies Complete<VindralScriptEngineState>
				break
			}
			case MappingVindralComposerType.Switcher: {
				if (content.type !== TimelineContentTypeVindralComposer.SWITCHER) break

				const switcherKey = mapping.options.switcherId ?? mapping.options.switcherName ?? layerId
				const existing = state.switchers[switcherKey]
				state.switchers[switcherKey] = {
					selector: mapping.options.switcherId
						? { target: mapping.options.switcherId }
						: { targetName: mapping.options.switcherName },
					foregroundInputName: content.switcher.foregroundInputName ?? existing?.foregroundInputName,
					backgroundInputName: content.switcher.backgroundInputName ?? existing?.backgroundInputName,
					crossfadeTransitionDuration:
						content.switcher.crossfadeTransitionDuration ?? existing?.crossfadeTransitionDuration,
					// null explicitly clears the transition (stage without taking); only fall back to
					// existing when this object doesn't specify a transition at all.
					transition: content.switcher.transition !== undefined ? content.switcher.transition : existing?.transition,
					timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
				} satisfies Complete<VindralSwitcherState>
				break
			}
			case MappingVindralComposerType.SwitcherOverlay: {
				if (content.type !== TimelineContentTypeVindralComposer.SWITCHER_OVERLAY) break

				const overlayKey = `${mapping.options.switcherId ?? mapping.options.switcherName ?? layerId}/${mapping.options.overlay}`
				const existing = state.switcherOverlays[overlayKey]

				state.switcherOverlays[overlayKey] = {
					selector: mapping.options.switcherId
						? { target: mapping.options.switcherId }
						: { targetName: mapping.options.switcherName },
					overlayNumber: mapping.options.overlay,
					inputName: content.switcherOverlay.inputName ?? existing?.inputName,
					show: content.switcherOverlay.show ?? existing?.show,
					timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
				} satisfies Complete<VindralSwitcherOverlayState>
				break
			}
			case MappingVindralComposerType.MediaPlayer: {
				if (content.type !== TimelineContentTypeVindralComposer.MEDIA_PLAYER) break

				// When inserted by lookahead, seek the preloaded clip forward so it is at the
				// position it should be once it goes live (lookaheadOffset = amount already played).
				const inTimeWithLookaheadOffset =
					content.mediaPlayer.inTime !== undefined && obj.lookaheadOffset !== undefined
						? content.mediaPlayer.inTime + obj.lookaheadOffset
						: (content.mediaPlayer.inTime ?? obj.lookaheadOffset)

				state.mediaPlayers[layerId] = {
					selector: { target: mapping.options.mediaPlayerId, targetName: mapping.options.mediaPlayerName },
					autoPlayOnMediaChange: mapping.options.autoPlayOnMediaChange,
					sourceUrl: content.mediaPlayer.sourceUrl,
					inTime: !obj.isLookahead ? content.mediaPlayer.inTime : inTimeWithLookaheadOffset,
					outTime: content.mediaPlayer.outTime,
					endBehaviour: content.mediaPlayer.endBehaviour,
					playing: content.mediaPlayer.playing ?? true,
					instanceStartTime: obj.instance.start,
					timelineObjIds: [obj.id],
				} satisfies Complete<VindralMediaPlayerState>
				break
			}
			case MappingVindralComposerType.AudioSource: {
				if (content.type !== TimelineContentTypeVindralComposer.AUDIO_SOURCE) break

				const key = mapping.options.audioSourceId ?? mapping.options.audioSourceName ?? layerId
				const existing = state.audioSources[key]

				state.audioSources[key] = {
					selector: mapping.options.audioSourceId
						? { target: mapping.options.audioSourceId }
						: { targetName: mapping.options.audioSourceName },
					stereoGainDb: content.audioSource.stereoGainDb ?? existing?.stereoGainDb,
					pan: content.audioSource.pan ?? existing?.pan,
					mute: content.audioSource.mute ?? existing?.mute,
					timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
				} satisfies Complete<VindralAudioSourceState>
				break
			}
			case MappingVindralComposerType.Html: {
				if (content.type !== TimelineContentTypeVindralComposer.HTML) break

				const htmlKey = mapping.options.webPageRendererId ?? mapping.options.webPageRendererName ?? layerId
				const existing = state.htmlRenderers[htmlKey]

				state.htmlRenderers[htmlKey] = {
					selector: mapping.options.webPageRendererId
						? { target: mapping.options.webPageRendererId }
						: { targetName: mapping.options.webPageRendererName },
					url: content.html.url ?? existing?.url,
					running: content.html.running ?? existing?.running ?? true,
					reloadKey: content.html.reloadKey ?? existing?.reloadKey,
					timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
				} satisfies Complete<VindralHtmlState>
				break
			}
			default:
				assertNever(mapping.options)
		}
	}
	return state
}
