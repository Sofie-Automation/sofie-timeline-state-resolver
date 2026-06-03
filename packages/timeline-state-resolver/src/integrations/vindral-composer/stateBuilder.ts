import {
	DeviceType,
	MappingVindralComposerType,
	TimelineContentTypeVindralComposer,
	type Mappings,
	type TSRTimelineContent,
	type SomeMappingVindralComposer,
	VindralComposerPlaybackEndCondition,
} from 'timeline-state-resolver-types'
import { assertNever } from '../../lib.js'
import type { DeviceTimelineState } from 'timeline-state-resolver-api'

export interface VindralComposerDeviceState {
	stateTime: number
	connectors: Record<string, VindralConnectorState | undefined>
	sceneLayers: Record<string, VindralSceneLayerState | undefined>
	scriptEngines: Record<string, VindralScriptEngineState | undefined>
	switchers: Record<string, VindralSwitcherState | undefined>
	mediaPlayers: Record<string, VindralMediaPlayerState | undefined>
	htmlRenderers: Record<string, VindralHtmlState | undefined>
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
	transition?: 'cut' | 'crossfade'
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
		mediaPlayers: {},
		htmlRenderers: {},
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
				}
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
				}
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
				}
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
					transition: c.switcher.transition ?? existing?.transition,
					timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
				}
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
				}
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
				}
				break
			}
			default:
				assertNever(mapping.options)
		}
	}
	return state
}
