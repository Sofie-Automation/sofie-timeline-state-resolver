import {
	DeviceType,
	MappingVindralComposerType,
	TimelineContentTypeVindralComposer,
	type Mappings,
	type TSRTimelineContent,
	type SomeMappingVindralComposer,
	VindralComposerPlaybackEndCondition,
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
	inTime?: number
	outTime?: number
	playbackEndCondition?: VindralComposerPlaybackEndCondition
	autoPlay?: boolean
	playing?: boolean
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
				const c = content
				state.connectors[layerId] = {
					name: c.connector.name,
					value: c.connector.value,
					params: c.connector.params,
					timelineObjIds: [obj.id],
				} satisfies Complete<VindralConnectorState>
				break
			}
			case MappingVindralComposerType.SceneLayer: {
				if (content.type !== TimelineContentTypeVindralComposer.SCENE_LAYER) break
				const c = content
				const m = mapping.options
				state.sceneLayers[`${m.scene}/${m.layer}`] = {
					scene: m.scene,
					layer: m.layer,
					source: c.sceneLayer.source,
					timelineObjIds: [obj.id],
				} satisfies Complete<VindralSceneLayerState>
				break
			}
			case MappingVindralComposerType.ScriptEngine: {
				if (content.type !== TimelineContentTypeVindralComposer.SCRIPT_ENGINE) break
				const c = content
				const m = mapping.options
				state.scriptEngines[m.functionName] = {
					functionName: m.functionName,
					parameter: c.scriptEngine.parameter,
					timelineObjIds: [obj.id],
				} satisfies Complete<VindralScriptEngineState>
				break
			}
			case MappingVindralComposerType.Switcher: {
				if (content.type !== TimelineContentTypeVindralComposer.SWITCHER) break
				const c = content
				const m = mapping.options
				const switcherKey = m.switcherId ?? m.switcherName ?? layerId
				const existing = state.switchers[switcherKey]
				state.switchers[switcherKey] = {
					selector: m.switcherId ? { target: m.switcherId } : { targetName: m.switcherName },
					foregroundInputName: c.switcher.foregroundInputName ?? existing?.foregroundInputName,
					backgroundInputName: c.switcher.backgroundInputName ?? existing?.backgroundInputName,
					crossfadeTransitionDuration: c.switcher.crossfadeTransitionDuration ?? existing?.crossfadeTransitionDuration,
					// null explicitly clears the transition (stage without taking); only fall back to
					// existing when this object doesn't specify a transition at all.
					transition: c.switcher.transition !== undefined ? c.switcher.transition : existing?.transition,
					timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
				} satisfies Complete<VindralSwitcherState>
				break
			}
			case MappingVindralComposerType.SwitcherOverlay: {
				if (content.type !== TimelineContentTypeVindralComposer.SWITCHER_OVERLAY) break
				const c = content
				const m = mapping.options
				const overlayKey = `${m.switcherId ?? m.switcherName ?? layerId}/${m.overlay}`
				const existing = state.switcherOverlays[overlayKey]
				state.switcherOverlays[overlayKey] = {
					selector: m.switcherId ? { target: m.switcherId } : { targetName: m.switcherName },
					overlayNumber: m.overlay,
					inputName: c.switcherOverlay.inputName ?? existing?.inputName,
					show: c.switcherOverlay.show ?? existing?.show,
					timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
				} satisfies Complete<VindralSwitcherOverlayState>
				break
			}
			case MappingVindralComposerType.MediaPlayer: {
				if (content.type !== TimelineContentTypeVindralComposer.MEDIA_PLAYER) break
				const c = content
				const m = mapping.options
				state.mediaPlayers[layerId] = {
					selector: { target: m.mediaPlayerId, targetName: m.mediaPlayerName },
					autoPlayOnMediaChange: m.autoPlayOnMediaChange,
					sourceUrl: c.mediaPlayer.sourceUrl,
					inTime: c.mediaPlayer.inTime,
					outTime: c.mediaPlayer.outTime,
					playbackEndCondition: c.mediaPlayer.playbackEndCondition,
					autoPlay: c.mediaPlayer.autoPlay,
					playing: c.mediaPlayer.playing,
					timelineObjIds: [obj.id],
				} satisfies Complete<VindralMediaPlayerState>
				break
			}
			case MappingVindralComposerType.AudioSource: {
				if (content.type !== TimelineContentTypeVindralComposer.AUDIO_SOURCE) break
				const c = content
				const m = mapping.options
				const key = m.audioSourceId ?? m.audioSourceName ?? layerId
				const existing = state.audioSources[key]
				state.audioSources[key] = {
					selector: m.audioSourceId ? { target: m.audioSourceId } : { targetName: m.audioSourceName },
					stereoGainDb: c.audioSource.stereoGainDb ?? existing?.stereoGainDb,
					pan: c.audioSource.pan ?? existing?.pan,
					mute: c.audioSource.mute ?? existing?.mute,
					timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
				} satisfies Complete<VindralAudioSourceState>
				break
			}
			case MappingVindralComposerType.Html: {
				if (content.type !== TimelineContentTypeVindralComposer.HTML) break
				const c = content
				const m = mapping.options
				const htmlKey = m.webPageRendererId ?? m.webPageRendererName ?? layerId
				const existing = state.htmlRenderers[htmlKey]
				state.htmlRenderers[htmlKey] = {
					selector: m.webPageRendererId ? { target: m.webPageRendererId } : { targetName: m.webPageRendererName },
					url: c.html.url ?? existing?.url,
					running: c.html.running ?? existing?.running,
					reloadKey: c.html.reloadKey ?? existing?.reloadKey,
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
