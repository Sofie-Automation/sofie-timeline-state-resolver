import {
	DeviceType,
	MappingVindralComposerType,
	TimelineContentTypeVindralComposer,
	type Mappings,
	type TSRTimelineContent,
	type SomeMappingVindralComposer,
	type MappingVindralComposerSceneLayer,
	type MappingVindralComposerScriptEngine,
	type MappingVindralComposerSwitcher,
	type MappingVindralComposerSwitcherOverlay,
	type MappingVindralComposerMediaPlayer,
	type MappingVindralComposerAudioSource,
	type MappingVindralComposerHtml,
	VindralComposerPlaybackEndBehaviour,
} from 'timeline-state-resolver-types'
import { assertNever, Complete } from '../../lib.js'
import type { DeviceTimelineState } from 'timeline-state-resolver-api'

type VindralTimelineObject = DeviceTimelineState<TSRTimelineContent>['objects'][number]
type VindralComposerTimelineContent = Extract<TSRTimelineContent, { deviceType: DeviceType.VINDRAL_COMPOSER }>

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

	for (const obj of [...timelineState.objects].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))) {
		const layerId = String(obj.layer)
		const mapping = mappings[layerId]
		if (!mapping || mapping.device !== DeviceType.VINDRAL_COMPOSER) continue
		const content = obj.content
		if (content.deviceType !== DeviceType.VINDRAL_COMPOSER) continue

		switch (mapping.options.mappingType) {
			case MappingVindralComposerType.Connector:
				applyConnector(state, obj, content, layerId)
				break
			case MappingVindralComposerType.SceneLayer:
				applySceneLayer(state, obj, mapping.options, content)
				break
			case MappingVindralComposerType.ScriptEngine:
				applyScriptEngine(state, obj, mapping.options, content)
				break
			case MappingVindralComposerType.Switcher:
				applySwitcher(state, obj, mapping.options, content, layerId)
				break
			case MappingVindralComposerType.SwitcherOverlay:
				applySwitcherOverlay(state, obj, mapping.options, content, layerId)
				break
			case MappingVindralComposerType.MediaPlayer:
				applyMediaPlayer(state, obj, mapping.options, content, layerId)
				break
			case MappingVindralComposerType.AudioSource:
				applyAudioSource(state, obj, mapping.options, content, layerId)
				break
			case MappingVindralComposerType.Html:
				applyHtml(state, obj, mapping.options, content, layerId)
				break
			default:
				assertNever(mapping.options)
		}
	}
	return state
}

function applyConnector(
	state: VindralComposerDeviceState,
	obj: VindralTimelineObject,
	content: VindralComposerTimelineContent,
	layerId: string
): void {
	if (content.type !== TimelineContentTypeVindralComposer.CONNECTOR) return

	state.connectors[layerId] = {
		name: content.connector.name,
		value: content.connector.value,
		params: content.connector.params,
		timelineObjIds: [obj.id],
	} satisfies Complete<VindralConnectorState>
}

function applySceneLayer(
	state: VindralComposerDeviceState,
	obj: VindralTimelineObject,
	options: MappingVindralComposerSceneLayer,
	content: VindralComposerTimelineContent
): void {
	if (content.type !== TimelineContentTypeVindralComposer.SCENE_LAYER) return

	state.sceneLayers[`${options.scene}/${options.layer}`] = {
		scene: options.scene,
		layer: options.layer,
		source: content.sceneLayer.source,
		timelineObjIds: [obj.id],
	} satisfies Complete<VindralSceneLayerState>
}

function applyScriptEngine(
	state: VindralComposerDeviceState,
	obj: VindralTimelineObject,
	options: MappingVindralComposerScriptEngine,
	content: VindralComposerTimelineContent
): void {
	if (content.type !== TimelineContentTypeVindralComposer.SCRIPT_ENGINE) return

	state.scriptEngines[options.functionName] = {
		functionName: options.functionName,
		parameter: content.scriptEngine.parameter,
		timelineObjIds: [obj.id],
	} satisfies Complete<VindralScriptEngineState>
}

function applySwitcher(
	state: VindralComposerDeviceState,
	obj: VindralTimelineObject,
	options: MappingVindralComposerSwitcher,
	content: VindralComposerTimelineContent,
	layerId: string
): void {
	if (content.type !== TimelineContentTypeVindralComposer.SWITCHER) return

	const switcherKey = options.switcherId ?? options.switcherName ?? layerId
	const existing = state.switchers[switcherKey]
	state.switchers[switcherKey] = {
		selector: options.switcherId ? { target: options.switcherId } : { targetName: options.switcherName },
		foregroundInputName: content.switcher.foregroundInputName ?? existing?.foregroundInputName,
		backgroundInputName: content.switcher.backgroundInputName ?? existing?.backgroundInputName,
		crossfadeTransitionDuration: content.switcher.crossfadeTransitionDuration ?? existing?.crossfadeTransitionDuration,
		// null explicitly clears the transition (stage without taking); only fall back to
		// existing when this object doesn't specify a transition at all.
		transition: content.switcher.transition !== undefined ? content.switcher.transition : existing?.transition,
		timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
	} satisfies Complete<VindralSwitcherState>
}

function applySwitcherOverlay(
	state: VindralComposerDeviceState,
	obj: VindralTimelineObject,
	options: MappingVindralComposerSwitcherOverlay,
	content: VindralComposerTimelineContent,
	layerId: string
): void {
	if (content.type !== TimelineContentTypeVindralComposer.SWITCHER_OVERLAY) return

	const overlayKey = `${options.switcherId ?? options.switcherName ?? layerId}/${options.overlay}`
	const existing = state.switcherOverlays[overlayKey]

	state.switcherOverlays[overlayKey] = {
		selector: options.switcherId ? { target: options.switcherId } : { targetName: options.switcherName },
		overlayNumber: options.overlay,
		inputName: content.switcherOverlay.inputName ?? existing?.inputName,
		show: content.switcherOverlay.show ?? existing?.show,
		timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
	} satisfies Complete<VindralSwitcherOverlayState>
}

function applyMediaPlayer(
	state: VindralComposerDeviceState,
	obj: VindralTimelineObject,
	options: MappingVindralComposerMediaPlayer,
	content: VindralComposerTimelineContent,
	layerId: string
): void {
	if (content.type !== TimelineContentTypeVindralComposer.MEDIA_PLAYER) return

	// When inserted by lookahead, seek the preloaded clip forward so it is at the
	// position it should be once it goes live (lookaheadOffset = amount already played).
	const inTimeWithLookaheadOffset =
		content.mediaPlayer.inTime !== undefined && obj.lookaheadOffset !== undefined
			? content.mediaPlayer.inTime + obj.lookaheadOffset
			: (content.mediaPlayer.inTime ?? obj.lookaheadOffset)

	state.mediaPlayers[layerId] = {
		selector: { target: options.mediaPlayerId, targetName: options.mediaPlayerName },
		autoPlayOnMediaChange: options.autoPlayOnMediaChange,
		sourceUrl: content.mediaPlayer.sourceUrl,
		inTime: !obj.isLookahead ? content.mediaPlayer.inTime : inTimeWithLookaheadOffset,
		outTime: content.mediaPlayer.outTime,
		endBehaviour: content.mediaPlayer.endBehaviour,
		playing: content.mediaPlayer.playing ?? true,
		instanceStartTime: obj.instance.start,
		timelineObjIds: [obj.id],
	} satisfies Complete<VindralMediaPlayerState>
}

function applyAudioSource(
	state: VindralComposerDeviceState,
	obj: VindralTimelineObject,
	options: MappingVindralComposerAudioSource,
	content: VindralComposerTimelineContent,
	layerId: string
): void {
	if (content.type !== TimelineContentTypeVindralComposer.AUDIO_SOURCE) return

	const key = options.audioSourceId ?? options.audioSourceName ?? layerId
	const existing = state.audioSources[key]

	state.audioSources[key] = {
		selector: options.audioSourceId ? { target: options.audioSourceId } : { targetName: options.audioSourceName },
		stereoGainDb: content.audioSource.stereoGainDb ?? existing?.stereoGainDb,
		pan: content.audioSource.pan ?? existing?.pan,
		mute: content.audioSource.mute ?? existing?.mute,
		timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
	} satisfies Complete<VindralAudioSourceState>
}

function applyHtml(
	state: VindralComposerDeviceState,
	obj: VindralTimelineObject,
	options: MappingVindralComposerHtml,
	content: VindralComposerTimelineContent,
	layerId: string
): void {
	if (content.type !== TimelineContentTypeVindralComposer.HTML) return

	const htmlKey = options.webPageRendererId ?? options.webPageRendererName ?? layerId
	const existing = state.htmlRenderers[htmlKey]

	state.htmlRenderers[htmlKey] = {
		selector: options.webPageRendererId
			? { target: options.webPageRendererId }
			: { targetName: options.webPageRendererName },
		url: content.html.url ?? existing?.url,
		running: content.html.running ?? existing?.running ?? true,
		reloadKey: content.html.reloadKey ?? existing?.reloadKey,
		timelineObjIds: [...(existing?.timelineObjIds ?? []), obj.id],
	} satisfies Complete<VindralHtmlState>
}
