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
	TimelineContentKairosPlayerState,
	TimelineContentKairosSceneSnapshotInfo,
	KairosMacroActiveState,
	TimelineContentKairosMacroInfo,
} from 'timeline-state-resolver-types'
import { assertNever } from '../../lib'
import {
	AuxRef,
	MediaClipRef,
	MediaSoundRef,
	MediaRamRecRef,
	refAuxName,
	refScene,
	refSceneLayer,
	refToPath,
	SceneLayerRef,
	UpdateSceneLayerObject,
	UpdateSceneObject,
	type SceneRef,
	SceneSnapshotRef,
	refSceneSnapshot,
	UpdateSceneSnapshotObject,
	MacroRef,
	refMacro,
	// eslint-disable-next-line node/no-missing-import
} from 'kairos-connection'

export interface KairosDeviceState {
	scenes: Record<string, { ref: SceneRef; state: Partial<UpdateSceneObject>; timelineObjIds: string[] } | undefined>
	sceneSnapshots: Record<
		string,
		| {
				ref: SceneSnapshotRef
				state: { active: boolean; properties: Partial<UpdateSceneSnapshotObject> }
				timelineObjIds: string[]
		  }
		| undefined
	>
	sceneLayers: Record<
		string,
		{ ref: SceneLayerRef; state: Partial<UpdateSceneLayerObject>; timelineObjIds: string[] } | undefined
	>
	aux: Record<string, { ref: AuxRef; state: TimelineContentKairosAux; timelineObjIds: string[] } | undefined>
	macros: Record<
		string,
		{ ref: MacroRef; state: { active: KairosMacroActiveState }; timelineObjIds: string[] } | undefined
	>
	clipPlayers: Record<
		number,
		{ ref: number; state: TimelineContentKairosPlayerState<MediaClipRef>; timelineObjIds: string[] } | undefined
	>
	ramRecPlayers: Record<
		number,
		{ ref: number; state: TimelineContentKairosPlayerState<MediaRamRecRef>; timelineObjIds: string[] } | undefined
	>
	stillPlayers: Record<
		number,
		{ ref: number; state: TimelineContentKairosStillPlayer; timelineObjIds: string[] } | undefined
	>
	soundPlayers: Record<
		number,
		{ ref: number; state: TimelineContentKairosPlayerState<MediaSoundRef>; timelineObjIds: string[] } | undefined
	>
}

export class KairosStateBuilder {
	// Start out with default state:
	readonly #deviceState: KairosDeviceState = {
		scenes: {},
		sceneSnapshots: {},
		sceneLayers: {},
		aux: {},
		macros: {},
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
							builder._applyScene(mapping.options, content, tlObject.id)
						}
						break
					case MappingKairosType.SceneLayer:
						if (content.type === TimelineContentTypeKairos.SCENE_LAYER) {
							builder._applySceneLayer(mapping.options, content, tlObject.id)
						}
						break
					case MappingKairosType.Aux:
						if (content.type === TimelineContentTypeKairos.AUX) {
							builder._applyAux(mapping.options, content, tlObject.id)
						}
						break
					case MappingKairosType.Macro:
						if (content.type === TimelineContentTypeKairos.MACROS) {
							builder._applyMacro(content, tlObject.id)
						}
						break
					case MappingKairosType.ClipPlayer:
						if (content.type === TimelineContentTypeKairos.CLIP_PLAYER) {
							builder._applyClipPlayer(mapping.options, content, tlObject.id)
						}
						break
					case MappingKairosType.RamRecPlayer:
						if (content.type === TimelineContentTypeKairos.RAMREC_PLAYER) {
							builder._applyRamRecPlayer(mapping.options, content, tlObject.id)
						}
						break
					case MappingKairosType.StillPlayer:
						if (content.type === TimelineContentTypeKairos.STILL_PLAYER) {
							builder._applyStillPlayer(mapping.options, content, tlObject.id)
						}
						break
					case MappingKairosType.SoundPlayer:
						if (content.type === TimelineContentTypeKairos.SOUND_PLAYER) {
							builder._applySoundPlayer(mapping.options, content, tlObject.id)
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

	private _mergeState<TState, TRef>(
		oldState:
			| {
					ref: TRef
					state: TState
					timelineObjIds: string[]
			  }
			| null
			| undefined,
		ref: TRef,
		state: TState,
		timelineObjId: string
	): { ref: TRef; state: TState; timelineObjIds: string[] } {
		return {
			ref: ref,
			state: { ...oldState?.state, ...state },
			timelineObjIds: oldState ? [...oldState.timelineObjIds, timelineObjId] : [timelineObjId],
		}
	}

	private _applyScene(mapping: MappingKairosScene, content: TimelineContentKairosScene, timelineObjId: string): void {
		if (!mapping.sceneName || mapping.sceneName.length === 0) return

		const sceneRef = refScene(mapping.sceneName)
		const sceneId = refToPath(sceneRef)

		// Perform a simple merge of the content into the state
		if (Object.keys(content.scene).length > 0) {
			this.#deviceState.scenes[sceneId] = this._mergeState(
				this.#deviceState.scenes[sceneId],
				sceneRef,
				content.scene,
				timelineObjId
			)
		}

		// Handle snapshots
		for (const snapshotInfo of Object.values<TimelineContentKairosSceneSnapshotInfo>(content.recallSnapshots)) {
			if (!snapshotInfo) continue

			const snapshotRef = refSceneSnapshot(sceneRef, snapshotInfo.ref)
			const snapshotId = refToPath(snapshotRef)

			this.#deviceState.sceneSnapshots[snapshotId] = this._mergeState(
				this.#deviceState.sceneSnapshots[snapshotId],
				snapshotRef,
				{
					active: snapshotInfo.active,
					properties: snapshotInfo.properties,
				},
				timelineObjId
			)
		}
	}

	private _applySceneLayer(
		mapping: MappingKairosSceneLayer,
		content: TimelineContentKairosSceneLayer,
		timelineObjId: string
	): void {
		if (!mapping.sceneName || mapping.sceneName.length === 0) return
		if (!mapping.layerName || mapping.layerName.length === 0) return

		const sceneLayerRef = refSceneLayer(refScene(mapping.sceneName), mapping.layerName)
		const sceneLayerId = refToPath(sceneLayerRef)

		// Perform a simple merge of the content into the state
		this.#deviceState.sceneLayers[sceneLayerId] = this._mergeState(
			this.#deviceState.sceneLayers[sceneLayerId],
			sceneLayerRef,
			content.sceneLayer,
			timelineObjId
		)
	}

	private _applyAux(mapping: MappingKairosAux, content: TimelineContentKairosAux, timelineObjId: string): void {
		if (!mapping.auxName || mapping.auxName.length === 0) return

		const auxRef = refAuxName(mapping.auxName)
		const auxId = refToPath(auxRef)

		// Perform a simple merge of the content into the state
		this.#deviceState.aux[auxId] = this._mergeState(this.#deviceState.aux[auxId], auxRef, content, timelineObjId)
	}

	private _applyMacro(content: TimelineContentKairosMacros, timelineObjId: string): void {
		for (const macroInfo of Object.values<TimelineContentKairosMacroInfo>(content.macros)) {
			if (!macroInfo) continue

			const macroRef = refMacro(macroInfo.ref)
			const macroId = refToPath(macroRef)

			this.#deviceState.macros[macroId] = this._mergeState(
				this.#deviceState.macros[macroId],
				macroRef,
				{
					active: macroInfo.active,
				},
				timelineObjId
			)
		}
	}

	private _applyClipPlayer(
		mapping: MappingKairosClipPlayer,
		content: TimelineContentKairosClipPlayer,
		timelineObjId: string
	): void {
		if (typeof mapping.playerId !== 'number' || mapping.playerId < 1) return

		const playerId = mapping.playerId

		this.#deviceState.clipPlayers[playerId] = this._mergeState(
			this.#deviceState.clipPlayers[playerId],
			playerId,
			content.clipPlayer,
			timelineObjId
		)
	}

	private _applyRamRecPlayer(
		mapping: MappingKairosRamRecPlayer,
		content: TimelineContentKairosRamRecPlayer,
		timelineObjId: string
	): void {
		if (typeof mapping.playerId !== 'number' || mapping.playerId < 1) return

		const playerId = mapping.playerId

		this.#deviceState.ramRecPlayers[playerId] = this._mergeState(
			this.#deviceState.ramRecPlayers[playerId],
			playerId,
			content.ramRecPlayer,
			timelineObjId
		)
	}

	private _applyStillPlayer(
		mapping: MappingKairosStillPlayer,
		content: TimelineContentKairosStillPlayer,
		timelineObjId: string
	): void {
		if (typeof mapping.playerId !== 'number' || mapping.playerId < 1) return

		const playerId = mapping.playerId

		this.#deviceState.stillPlayers[playerId] = this._mergeState(
			this.#deviceState.stillPlayers[playerId],
			playerId,
			content,
			timelineObjId
		)
	}

	private _applySoundPlayer(
		mapping: MappingKairosSoundPlayer,
		content: TimelineContentKairosSoundPlayer,
		timelineObjId: string
	): void {
		if (typeof mapping.playerId !== 'number' || mapping.playerId < 1) return

		const playerId = mapping.playerId

		this.#deviceState.soundPlayers[playerId] = this._mergeState(
			this.#deviceState.soundPlayers[playerId],
			playerId,
			content.soundPlayer,
			timelineObjId
		)
	}
}
