import {
	DeviceType,
	MappingVindralComposerType,
	TimelineContentTypeVindralComposer,
	type Mappings,
	type TSRTimelineContent,
	type SomeMappingVindralComposer,
} from 'timeline-state-resolver-types'
import type { DeviceTimelineState } from 'timeline-state-resolver-api'

export interface VindralComposerDeviceState {
	stateTime: number
	connectors: Record<string, VindralConnectorState | undefined>
	sceneLayers: Record<string, VindralSceneLayerState | undefined>
	scriptEngines: Record<string, VindralScriptEngineState | undefined>
	switchers: Record<string, VindralSwitcherState | undefined>
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
				state.switchers[layerId] = {
					selector: m.switcherId ? { target: m.switcherId } : { targetName: m.switcherName },
					foregroundInputName: c.switcher.foregroundInputName,
					backgroundInputName: c.switcher.backgroundInputName,
					crossfadeTransitionDuration: c.switcher.crossfadeTransitionDuration,
					transition: c.switcher.transition,
					timelineObjIds: [obj.id],
				}
				break
			}
		}
	}
	return state
}
