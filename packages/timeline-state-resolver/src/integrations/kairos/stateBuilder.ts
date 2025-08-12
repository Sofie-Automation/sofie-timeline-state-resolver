import {
	Mapping,
	SomeMappingKairos,
	DeviceType,
	MappingKairosType,
	TimelineContentTypeKairos,
	Mappings,
	TSRTimelineContent,
	Timeline,
	TimelineContentKairosScene,
	MappingKairosScene,
	TimelineContentKairosSceneLayer,
	MappingKairosSceneLayer,
	TimelineContentKairosMacros,
	TimelineContentKairosAux,
	TimelineContentKairosClipPlayer,
	TimelineContentKairosRamRecPlayer,
	TimelineContentKairosSoundPlayer,
	TimelineContentKairosStillPlayer,
	MappingKairosAux,
	MappingKairosClipPlayer,
	MappingKairosRamRecPlayer,
	MappingKairosStillPlayer,
	MappingKairosSoundPlayer,
} from 'timeline-state-resolver-types'
import { assertNever } from '../../lib'
// eslint-disable-next-line node/no-missing-import
import { AuxRef, refAuxName, refScene, refSceneLayer, refToPath, SceneLayerRef, type SceneRef } from 'kairos-connection'

export interface KairosDeviceState {
	scenes: Record<string, { ref: SceneRef; state: TimelineContentKairosScene }>
	sceneLayers: Record<string, { ref: SceneLayerRef; state: TimelineContentKairosSceneLayer }>
	aux: Record<string, { ref: AuxRef; state: TimelineContentKairosAux }>
	macros: TimelineContentKairosMacros | null
	clipPlayers: Record<number, { playerId: number; state: TimelineContentKairosClipPlayer }>
	ramRecPlayers: Record<number, { playerId: number; state: TimelineContentKairosRamRecPlayer }>
	stillPlayers: Record<number, { playerId: number; state: TimelineContentKairosStillPlayer }>
	soundPlayers: Record<number, { playerId: number; state: TimelineContentKairosSoundPlayer }>
}

export class KairosStateBuilder {
	// Start out with default state:
	readonly #deviceState: KairosDeviceState = {
		scenes: {},
		sceneLayers: {},
		aux: {},
		macros: null,
		clipPlayers: {},
		ramRecPlayers: {},
		stillPlayers: {},
		soundPlayers: {},
	}

	public static fromTimeline(
		timelineState: Timeline.StateInTime<TSRTimelineContent>,
		mappings: Mappings
	): KairosDeviceState {
		const builder = new KairosStateBuilder()

		// Sort layer based on Layer name
		const sortedLayers = Object.entries<Timeline.ResolvedTimelineObjectInstance<TSRTimelineContent>>(timelineState)
			.map(([layerName, tlObject]) => ({ layerName, tlObject }))
			.sort((a, b) => a.layerName.localeCompare(b.layerName))

		// For every layer, augment the state
		for (const { tlObject, layerName } of sortedLayers) {
			const content = tlObject.content

			const mapping = mappings[layerName] as Mapping<SomeMappingKairos> | undefined

			if (mapping && content.deviceType === DeviceType.KAIROS) {
				switch (mapping.options.mappingType) {
					case MappingKairosType.Scene:
						if (content.type === TimelineContentTypeKairos.SCENE) {
							builder._applyScene(mapping.options, content)
						}
						break
					case MappingKairosType.SceneLayer:
						if (content.type === TimelineContentTypeKairos.SCENE_LAYER) {
							builder._applySceneLayer(mapping.options, content)
						}
						break
					case MappingKairosType.Aux:
						if (content.type === TimelineContentTypeKairos.AUX) {
							builder._applyAux(mapping.options, content)
						}
						break
					case MappingKairosType.Macro:
						if (content.type === TimelineContentTypeKairos.MACROS) {
							builder._applyMacro(content)
						}
						break
					case MappingKairosType.ClipPlayer:
						if (content.type === TimelineContentTypeKairos.CLIP_PLAYER) {
							builder._applyClipPlayer(mapping.options, content)
						}
						break
					case MappingKairosType.RamRecPlayer:
						if (content.type === TimelineContentTypeKairos.RAMREC_PLAYER) {
							builder._applyRamRecPlayer(mapping.options, content)
						}
						break
					case MappingKairosType.StillPlayer:
						if (content.type === TimelineContentTypeKairos.STILL_PLAYER) {
							builder._applyStillPlayer(mapping.options, content)
						}
						break
					case MappingKairosType.SoundPlayer:
						if (content.type === TimelineContentTypeKairos.SOUND_PLAYER) {
							builder._applySoundPlayer(mapping.options, content)
						}
						break
					default:
						assertNever(mapping.options)
						break
				}
			}
		}

		return builder.#deviceState
	}

	private _applyScene(mapping: MappingKairosScene, content: TimelineContentKairosScene): void {
		if (!mapping.sceneName || mapping.sceneName.length === 0) return

		const sceneRef = refScene(mapping.sceneName)
		const sceneId = refToPath(sceneRef)

		// Perform a simple merge of the content into the state
		this.#deviceState.scenes[sceneId] = {
			ref: sceneRef,
			state: Object.assign({}, this.#deviceState.scenes[sceneId]?.state, content),
		}
	}

	private _applySceneLayer(mapping: MappingKairosSceneLayer, content: TimelineContentKairosSceneLayer): void {
		if (!mapping.sceneName || mapping.sceneName.length === 0) return
		if (!mapping.layerName || mapping.layerName.length === 0) return

		const sceneLayerRef = refSceneLayer(refScene(mapping.sceneName), mapping.layerName)
		const sceneLayerId = refToPath(sceneLayerRef)

		// Perform a simple merge of the content into the state
		this.#deviceState.sceneLayers[sceneLayerId] = {
			ref: sceneLayerRef,
			state: Object.assign({}, this.#deviceState.sceneLayers[sceneLayerId]?.state, content),
		}
	}

	private _applyAux(mapping: MappingKairosAux, content: TimelineContentKairosAux): void {
		if (!mapping.auxName || mapping.auxName.length === 0) return

		const auxRef = refAuxName(mapping.auxName)
		const auxId = refToPath(auxRef)

		// Perform a simple merge of the content into the state
		this.#deviceState.aux[auxId] = {
			ref: auxRef,
			state: Object.assign({}, this.#deviceState.aux[auxId]?.state, content),
		}
	}

	private _applyMacro(content: TimelineContentKairosMacros): void {
		this.#deviceState.macros = Object.assign({}, this.#deviceState.macros, content)
	}

	private _applyClipPlayer(mapping: MappingKairosClipPlayer, content: TimelineContentKairosClipPlayer): void {
		if (typeof mapping.playerId !== 'number' || mapping.playerId < 1) return

		const playerId = mapping.playerId

		this.#deviceState.clipPlayers[playerId] = {
			playerId,
			state: Object.assign({}, this.#deviceState.clipPlayers[playerId]?.state, content),
		}
	}

	private _applyRamRecPlayer(mapping: MappingKairosRamRecPlayer, content: TimelineContentKairosRamRecPlayer): void {
		if (typeof mapping.playerId !== 'number' || mapping.playerId < 1) return

		const playerId = mapping.playerId

		this.#deviceState.ramRecPlayers[playerId] = {
			playerId,
			state: Object.assign({}, this.#deviceState.ramRecPlayers[playerId]?.state, content),
		}
	}

	private _applyStillPlayer(mapping: MappingKairosStillPlayer, content: TimelineContentKairosStillPlayer): void {
		if (typeof mapping.playerId !== 'number' || mapping.playerId < 1) return

		const playerId = mapping.playerId

		this.#deviceState.stillPlayers[playerId] = {
			playerId,
			state: Object.assign({}, this.#deviceState.stillPlayers[playerId]?.state, content),
		}
	}

	private _applySoundPlayer(mapping: MappingKairosSoundPlayer, content: TimelineContentKairosSoundPlayer): void {
		if (typeof mapping.playerId !== 'number' || mapping.playerId < 1) return

		const playerId = mapping.playerId

		this.#deviceState.soundPlayers[playerId] = {
			playerId,
			state: Object.assign({}, this.#deviceState.soundPlayers[playerId]?.state, content),
		}
	}
}
