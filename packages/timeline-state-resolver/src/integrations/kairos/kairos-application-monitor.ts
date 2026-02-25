import EventEmitter from 'node:events'
import {
	AnySourceRef,
	AudioPlayerRef,
	KairosConnection,
	MacroRef,
	MediaRamRecRef,
	refAudioPlayer,
	refAuxName,
	refClipPlayer,
	refImageStore,
	refRamRecorder,
	refScene,
	refSceneLayer,
	SceneLayerRef,
	parseAnySourceRef,
	SceneSnapshotRef,
	MediaSoundRef,
	refToPath,
	ResponseError,
} from 'kairos-connection'
import {
	AuxRef,
	DeviceStatus,
	DeviceType,
	Mapping,
	MappingKairosType,
	Mappings,
	MediaClipRef,
	MediaImageRef,
	MediaStillRef,
	SceneLayerEffectRef,
	SomeMappingKairos,
	StatusCode,
} from 'timeline-state-resolver-types'
import * as _ from 'underscore'
import {
	KairosDeviceState,
	KairosDeviceStateAux,
	KairosDeviceStateClipPlayers,
	KairosDeviceStateImageStores,
	KairosDeviceStateMacros,
	KairosDeviceStateRamRecPlayers,
	KairosDeviceStateSceneLayers,
	KairosDeviceStateScenes,
	KairosDeviceStateSceneSnapshots,
	KairosDeviceStateSoundPlayers,
} from './stateBuilder.js'
import { DeviceContextAPI } from 'timeline-state-resolver-api'
import { assertNever, cloneDeep } from '../../lib.js'

/**
 * This class is responsible for checking that the Kairos
 * is set up correctly, and that all referenced items in the mappings and state
 * exist on the Kairos.
 */
export class KairosApplicationMonitor extends EventEmitter<KairosApplicationMonitorEvents> {
	public MONITOR_INTERVAL = 60000 // 60 seconds
	public QUICK_CHECK_INTERVAL = 3000 // 3 seconds

	/** Set of things we're aware of, and should exist */
	private readonly aware: SetWithTimeout<
		| SceneLayerRef
		| SceneSnapshotRef
		| SceneLayerEffectRef
		| AuxRef
		| MacroRef
		| AnySourceRef
		| AudioPlayerRef
		| MediaClipRef
		| MediaStillRef
		| MediaImageRef
		| MediaRamRecRef
		| MediaSoundRef
	>

	private _mappings: Mappings<SomeMappingKairos> | null = null
	private _previousDeviceState: KairosDeviceState | null = null

	private _checkTimeout: NodeJS.Timeout | null = null
	private _checkTimeoutAsap = false
	private terminated = false

	public status: DeviceStatus = {
		statusCode: StatusCode.UNKNOWN,
		messages: [],
		active: false,
	}

	constructor(
		private readonly context: DeviceContextAPI<KairosDeviceState>,
		private readonly kairos: KairosConnection
	) {
		super()

		this.aware = new SetWithTimeout(
			this.MONITOR_INTERVAL * 2 // Keep items for twice the monitor interval, to ensure we don't drop them too quickly
		)
		this.triggerCheckApplicationStatus()
	}
	terminate() {
		this.terminated = true
		if (this._checkTimeout) clearTimeout(this._checkTimeout)
	}
	/**
	 * Is called whenever the mappings have been updated
	 */
	updateMappings(mappings: Mappings<SomeMappingKairos>): void {
		if (!_.isEqual(mappings, this._mappings)) {
			this._mappings = cloneDeep(mappings)
			this.triggerCheckApplicationStatus(true)
		}
	}
	/** Is called whenever the deviceState is updated */
	updateDeviceState(deviceState: KairosDeviceState): void {
		deviceState = {
			...deviceState,
			stateTime: 0, // Not used
		}
		if (!_.isEqual(this._previousDeviceState, deviceState)) {
			this._previousDeviceState = deviceState
			this.applyDeviceState(deviceState)

			this.triggerCheckApplicationStatus(true)
		}
	}

	private triggerCheckApplicationStatus(asap?: boolean) {
		if (this.terminated) return

		if (this._checkTimeout) {
			if (asap && !this._checkTimeoutAsap) clearTimeout(this._checkTimeout)
			else return // Is already queued for later
		}

		this._checkTimeoutAsap = Boolean(asap)
		this._checkTimeout = setTimeout(
			() => {
				this._checkTimeout = null
				if (this.terminated) return

				this.checkApplicationStatus()
					.catch((e) => {
						this.emit('error', e)
					})
					.finally(() => {
						this.triggerCheckApplicationStatus(false)
					})
			},
			asap ? this.QUICK_CHECK_INTERVAL : this.MONITOR_INTERVAL
		)
	}
	private applyMappings() {
		// Populate this.aware with references from mappings:
		if (!this._mappings) return
		for (const mapping of Object.values<Mapping<SomeMappingKairos>>(this._mappings)) {
			if (mapping.device !== DeviceType.KAIROS) continue

			if (mapping.options.mappingType === MappingKairosType.Scene) {
				this.aware.add(refScene(mapping.options.sceneName))
			} else if (mapping.options.mappingType === MappingKairosType.SceneLayer) {
				this.aware.add(refSceneLayer(refScene(mapping.options.sceneName), mapping.options.layerName))
			} else if (mapping.options.mappingType === MappingKairosType.Aux) {
				this.aware.add(refAuxName(mapping.options.auxName))
			} else if (mapping.options.mappingType === MappingKairosType.Macro) {
				// Nothing
			} else if (mapping.options.mappingType === MappingKairosType.ClipPlayer) {
				this.aware.add(refClipPlayer(mapping.options.playerId))
			} else if (mapping.options.mappingType === MappingKairosType.RamRecPlayer) {
				this.aware.add(refRamRecorder(mapping.options.playerId))
			} else if (mapping.options.mappingType === MappingKairosType.ImageStore) {
				this.aware.add(refImageStore(mapping.options.playerId))
			} else if (mapping.options.mappingType === MappingKairosType.SoundPlayer) {
				this.aware.add(refAudioPlayer(mapping.options.playerId))
			} else {
				assertNever(mapping.options)
			}
		}
	}
	private applyDeviceState(deviceState: KairosDeviceState) {
		// Populate this.aware with references from deviceState:

		for (const aux of Object.values<KairosDeviceStateAux>(deviceState.aux)) {
			if (!aux) continue
			this.aware.add(aux.ref)
			if (aux.state.aux.source) this.aware.add(aux.state.aux.source)
		}
		for (const clipPlayer of Object.values<KairosDeviceStateClipPlayers>(deviceState.clipPlayers)) {
			if (!clipPlayer) continue
			this.aware.add(refClipPlayer(clipPlayer.ref))
			if (clipPlayer.state.content.clip) this.aware.add(clipPlayer.state.content.clip)
		}
		for (const imageStore of Object.values<KairosDeviceStateImageStores>(deviceState.imageStores)) {
			if (!imageStore) continue
			this.aware.add(refImageStore(imageStore.ref))
			if (imageStore.state.content.imageStore.clip) this.aware.add(imageStore.state.content.imageStore.clip)
		}
		for (const macro of Object.values<KairosDeviceStateMacros>(deviceState.macros)) {
			if (!macro) continue
			this.aware.add(macro.ref)
		}
		for (const ramrecPlayer of Object.values<KairosDeviceStateRamRecPlayers>(deviceState.ramRecPlayers)) {
			if (!ramrecPlayer) continue
			this.aware.add(refRamRecorder(ramrecPlayer.ref))
			if (ramrecPlayer.state.content.clip) this.aware.add(ramrecPlayer.state.content.clip)
		}
		for (const sceneLayer of Object.values<KairosDeviceStateSceneLayers>(deviceState.sceneLayers)) {
			if (!sceneLayer) continue
			this.aware.add(sceneLayer.ref)
			if (sceneLayer.state.sourceA) this.aware.add(makeAnySourceRef(sceneLayer.state.sourceA))
			if (sceneLayer.state.sourcePgm) this.aware.add(makeAnySourceRef(sceneLayer.state.sourcePgm))
			if (sceneLayer.state.sourcePst) this.aware.add(makeAnySourceRef(sceneLayer.state.sourcePst))
		}
		for (const sceneSnapshot of Object.values<KairosDeviceStateSceneSnapshots>(deviceState.sceneSnapshots)) {
			if (!sceneSnapshot) continue
			this.aware.add(sceneSnapshot.ref)
		}
		for (const scene of Object.values<KairosDeviceStateScenes>(deviceState.scenes)) {
			if (!scene) continue
			this.aware.add(scene.ref)
		}
		for (const soundPlayer of Object.values<KairosDeviceStateSoundPlayers>(deviceState.soundPlayers)) {
			if (!soundPlayer) continue
			this.aware.add(refAudioPlayer(soundPlayer.ref))
			if (soundPlayer.state.content.clip) this.aware.add(soundPlayer.state.content.clip)
		}
	}
	private async checkApplicationStatus() {
		this.applyMappings()

		const issues: string[] = []
		const ensureExists = async (pExists: Promise<boolean>, description: string): Promise<void> => {
			try {
				const value = await pExists

				if (value === false) {
					issues.push(`${description} not found on the Kairos.`)
				}
			} catch (e) {
				if (e instanceof ResponseError) {
					issues.push(`${description}) not found on the Kairos.`)
				} else {
					this.emit('error', e instanceof Error ? e : new Error(e + ''))
				}
			}
		}
		let i = 0
		for (const sourceRef of this.aware.values()) {
			i++
			// Don't send too many commands at once:
			if (i >= 10) {
				i = 0
				await sleep(500)
			}

			if (sourceRef.realm === 'clipPlayer') {
				await ensureExists(this.kairos.clipPlayerExists(sourceRef), `Clip Player "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'ramRecorder') {
				await ensureExists(this.kairos.ramRecorderExists(sourceRef), `Ram Recorder "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'imageStore') {
				await ensureExists(this.kairos.imageStoreExists(sourceRef), `Image Store "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'scene') {
				await ensureExists(this.kairos.sceneExists(sourceRef), `Scene "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'ip-input') {
				await ensureExists(this.kairos.inputExists(sourceRef), `IP Input "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'sdi-input') {
				await ensureExists(this.kairos.inputExists(sourceRef), `SDI Input "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'ndi-input') {
				await ensureExists(this.kairos.inputExists(sourceRef), `NDI Input "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'stream-input') {
				await ensureExists(this.kairos.inputExists(sourceRef), `Stream Input "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'hdmi-input') {
				await ensureExists(this.kairos.inputExists(sourceRef), `HDMI Input "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'media-still') {
				await ensureExists(this.kairos.mediaStillExists(sourceRef), `Media Still "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'media-ramrec') {
				await ensureExists(this.kairos.mediaRamRecExists(sourceRef), `Media RamRec "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'matte') {
				// There is no method to check a matte individually (yet)
			} else if (sourceRef.realm === 'gfx-channel') {
				await ensureExists(this.kairos.gfxChannelExists(sourceRef), `GFX Channel "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'source-base') {
				// Ignore, eg: BLACK / WHITE
			} else if (sourceRef.realm === 'source-int') {
				// Ignore, eg: ColorBar / ColorCircle
			} else if (sourceRef.realm === 'mv-int') {
				await ensureExists(
					this.kairos.multiViewerSourceExists(sourceRef),
					`MultiViewer Source "${refToPath(sourceRef)}"`
				)
			} else if (sourceRef.realm === 'scene-snapshot') {
				await ensureExists(this.kairos.sceneSnapshotExists(sourceRef), `Scene Snapshot "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'scene-layer') {
				await ensureExists(this.kairos.sceneLayerExists(sourceRef), `Scene Layer "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'macro') {
				await ensureExists(this.kairos.macroExists(sourceRef), `Macro "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'media-sound') {
				await ensureExists(this.kairos.mediaSoundExists(sourceRef), `Media Sound "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'audio-player') {
				await ensureExists(this.kairos.audioPlayerExists(sourceRef), `Audio Player "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'scene-layer-effect') {
				// There is no method to check a sceneLayerEffect individually (yet)
			} else if (sourceRef.realm === 'aux') {
				await ensureExists(this.kairos.auxExists(sourceRef), `Aux "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'media-clip') {
				await ensureExists(this.kairos.mediaClipExists(sourceRef), `Media Clip "${refToPath(sourceRef)}"`)
			} else if (sourceRef.realm === 'media-image') {
				await ensureExists(this.kairos.mediaImageExists(sourceRef), `Media Image "${refToPath(sourceRef)}"`)
			} else {
				assertNever(sourceRef)
			}
		}

		const status: DeviceStatus = {
			statusCode: issues.length > 0 ? StatusCode.BAD : StatusCode.GOOD,
			messages: issues,
			active: true,
		}
		if (!_.isEqual(this.status, status)) {
			if (status.statusCode !== StatusCode.GOOD) {
				this.context.logger.warning(`Kairos Application Monitor status: ${JSON.stringify(status)}`)
			}

			this.status = status
			this.emit('statusChanged', status)
		}
	}
}
export interface KairosApplicationMonitorEvents {
	statusChanged: [status: DeviceStatus]
	error: [error: Error]
}

function makeAnySourceRef(value: string | AnySourceRef): AnySourceRef {
	if (typeof value === 'string') {
		return parseAnySourceRef(value)
	} else {
		return value
	}
}
async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Convenience class.
 * It's like Set(), but the values have a TTL
 */
class SetWithTimeout<T> {
	private readonly store = new Map<
		string,
		{
			value: T
			ttl: number
		}
	>()

	constructor(private readonly ttl: number) {}
	add(value: T): void {
		const key = JSON.stringify(value)
		this.store.set(key, {
			value,
			ttl: Date.now() + this.ttl,
		})
	}
	values(): T[] {
		const now = Date.now()

		const result: T[] = []
		for (const [key, val] of this.store.entries()) {
			if (val.ttl > now) {
				result.push(val.value)
			} else {
				// clean up:
				this.store.delete(key)
			}
		}
		return result
	}
}
