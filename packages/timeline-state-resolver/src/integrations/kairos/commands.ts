import {
	type UpdateSceneObject,
	type UpdateSceneLayerObject,
	type UpdateAuxObject,
	type UpdateClipPlayerObject,
	type SceneRef,
	type SceneLayerRef,
	type AuxRef,
	type MacroRef,
	type SceneSnapshotRef,
	type KairosConnection,
	type UpdateRamRecPlayerObject,
	type UpdateAudioPlayerObject,
	type UpdateImageStoreObject,
	isRef,
} from 'kairos-connection'
import { assertNever } from '../../lib.js'
import { isEqual } from 'underscore'
import type { KairosRamLoader } from './lib/kairosRamLoader.js'

export type KairosCommandAny =
	| KairosSceneCommand
	| KairosSceneRecallSnapshotCommand
	| KairosSceneLayerCommand
	| KairosAuxCommand
	| KairosMacroCommand
	| KairosClipPlayerCommand
	| KairosRamRecPlayerCommand
	| KairosImageStoreCommand
	| KairosSoundPlayerCommand
	| KairosPlayerCommandMethod

export interface KairosSceneCommand {
	type: 'scene'

	ref: SceneRef

	values: Partial<UpdateSceneObject>
}

export interface KairosSceneRecallSnapshotCommand {
	type: 'scene-recall-snapshot'

	ref: SceneSnapshotRef

	snapshotName: string
	active: boolean | undefined
}

export interface KairosSceneLayerCommand {
	type: 'scene-layer'

	ref: SceneLayerRef
	sceneLayerId: string

	values: Partial<UpdateSceneLayerObject>
}

export interface KairosAuxCommand {
	type: 'aux'

	ref: AuxRef

	values: Partial<UpdateAuxObject>
}

export interface KairosMacroCommand {
	type: 'macro'

	macroName: string
	macroRef: MacroRef
	active: boolean
}

export interface KairosClipPlayerCommand {
	type: 'clip-player'

	playerId: number

	values: Partial<UpdateClipPlayerObject>
}
export interface KairosPlayerCommandMethod {
	type: 'media-player:do'
	playerId: number
	playerType: 'clip-player' | 'ram-rec-player' | 'sound-player'
	command:
		| 'begin'
		| 'rewind'
		| 'stepBack'
		| 'reverse'
		| 'play'
		| 'pause'
		| 'stop'
		| 'stepForward'
		| 'fastForward'
		| 'end'
		| 'playlistBegin'
		| 'playlistBack'
		| 'playlistNext'
		| 'playlistEnd'
}

export interface KairosRamRecPlayerCommand {
	type: 'ram-rec-player'

	playerId: number

	values: Partial<UpdateRamRecPlayerObject>
}

export interface KairosImageStoreCommand {
	type: 'image-store'

	playerId: number

	values: Partial<UpdateImageStoreObject>
}

export interface KairosSoundPlayerCommand {
	type: 'sound-player'

	playerId: number

	values: Partial<UpdateAudioPlayerObject>
}

export async function sendCommand(
	kairos: KairosConnection,
	kairosRamLoader: KairosRamLoader,
	command: KairosCommandAny
): Promise<void> {
	const commandType = command.type
	switch (command.type) {
		case 'scene':
			await kairos.updateScene(command.ref, command.values)
			break
		case 'scene-recall-snapshot':
			if (command.active === true) {
				await kairos.sceneSnapshotRecall(command.ref)
			} else if (command.active === false) {
				await kairos.sceneSnapshotAbort(command.ref)
			} else if (command.active === undefined) {
				// Do nothing
			} else {
				assertNever(command.active)
			}
			break
		case 'scene-layer': {
			const values = { ...command.values }
			if (values.sourceA) {
				// Handle loading ramrec/still into RAM if needed
				const source = values.sourceA
				delete values.sourceA

				await kairos.updateSceneLayer(command.ref, { sourceA: source })

				await kairosRamLoader.ensureRAMLoaded(`sceneLayer_${command.sceneLayerId}`, source, (currentState) => {
					// This is called after the RAM load is done
					const sceneLayer = currentState?.sceneLayers[command.sceneLayerId]
					if (sceneLayer && isEqual(sceneLayer.state.sourceA, source)) {
						// Only modify if it is the same source:
						delete sceneLayer.state.sourceA
						return currentState
					} else return false
				})
			}
			if (values.sourcePgm) {
				// Handle loading ramrec/still into RAM if needed
				const source = values.sourcePgm
				delete values.sourcePgm

				await kairos.updateSceneLayer(command.ref, { sourcePgm: source })

				await kairosRamLoader.ensureRAMLoaded(`sceneLayer_${command.sceneLayerId}`, source, (currentState) => {
					// This is called after the RAM load is done
					const sceneLayer = currentState?.sceneLayers[command.sceneLayerId]
					if (sceneLayer && isEqual(sceneLayer.state.sourcePgm, source)) {
						// Only modify if it is the same still:
						delete sceneLayer.state.sourcePgm
						return currentState
					} else return false
				})
			}
			if (values.sourcePst) {
				// Handle loading ramrec/still into RAM if needed
				const source = values.sourcePst
				delete values.sourcePst

				await kairos.updateSceneLayer(command.ref, { sourcePst: source })

				await kairosRamLoader.ensureRAMLoaded(`sceneLayer_${command.sceneLayerId}`, source, (currentState) => {
					// This is called after the RAM load is done
					const sceneLayer = currentState?.sceneLayers[command.sceneLayerId]
					if (sceneLayer && isEqual(sceneLayer.state.sourcePst, source)) {
						// Only modify if it is the same still:
						delete sceneLayer.state.sourcePst
						return currentState
					} else return false
				})
			}

			await kairos.updateSceneLayer(command.ref, values)
			break
		}
		case 'aux':
			await kairos.updateAux(command.ref, command.values)
			break
		case 'macro':
			if (command.active) {
				await kairos.macroRecall(command.macroRef)
			} else {
				await kairos.macroStop(command.macroRef)
			}
			break
		case 'clip-player': {
			const values = { ...command.values }
			if (values.clip) {
				await kairos.loadClipPlayerClip(command.playerId, values.clip, values.position)
				delete values.clip
				delete values.position
			}
			await kairos.updateClipPlayer(command.playerId, values)
			break
		}
		case 'media-player:do': {
			switch (command.command) {
				case 'begin': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerBegin(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderBegin(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerBegin(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'rewind': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerRewind(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderRewind(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerRewind(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'stepBack': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerStepBack(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderStepBack(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerStepBack(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'reverse': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerReverse(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderReverse(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerReverse(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'play': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerPlay(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderPlay(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerPlay(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'pause': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerPause(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderPause(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerPause(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'stop': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerStop(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderStop(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerStop(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'stepForward': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerStepForward(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderStepForward(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerStepForward(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'fastForward': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerFastForward(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderFastForward(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerFastForward(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'end': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerEnd(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderEnd(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerEnd(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'playlistBegin': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerPlaylistBegin(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderPlaylistBegin(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerPlaylistBegin(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'playlistBack': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerPlaylistBack(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderPlaylistBack(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerPlaylistBack(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'playlistNext': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerPlaylistNext(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderPlaylistNext(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerPlaylistNext(command.playerId)
					else assertNever(command.playerType)
					break
				}
				case 'playlistEnd': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerPlaylistEnd(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderPlaylistEnd(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerPlaylistEnd(command.playerId)
					else assertNever(command.playerType)
					break
				}
				default:
					assertNever(command.command)
					throw new Error(`Unknown Kairos command.command type: ${command.command}`)
			}
			break
		}
		case 'ram-rec-player': {
			const values = { ...command.values }
			if (values.clip) {
				// Handle loading ramrec/still into RAM if needed
				const clip = values.clip
				delete values.clip

				await kairos.updateRamRecorder(command.playerId, {
					clip: clip,
				})

				await kairosRamLoader.ensureRAMLoaded(command.playerId, clip, (currentState) => {
					// This is called after the RAM load is done,
					//
					const player = currentState?.ramRecPlayers[command.playerId]
					if (player && isEqual(player.state.content.clip, clip)) {
						// Only modify if it is the same clip:
						// delete player.state.content.clip
						delete currentState.ramRecPlayers[command.playerId]
						return currentState
					}

					return false
				})
			}

			await kairos.updateRamRecorder(command.playerId, values)
			break
		}
		case 'image-store': {
			const values = { ...command.values }
			if (values.clip) {
				// Handle loading ramrec/still into RAM if needed
				const clip = values.clip
				delete values.clip

				await kairos.updateImageStore(command.playerId, {
					clip: clip,
				})

				if (isRef(clip) && clip.realm === 'media-still') {
					// type guard

					await kairosRamLoader.ensureRAMLoaded(command.playerId, clip, (currentState) => {
						// This is called after the RAM load is done,
						//
						const player = currentState?.imageStores[command.playerId]
						if (player && isEqual(player.state.content.imageStore.clip, clip)) {
							// Only modify if it is the same still
							// player.state.content.imageStore.clip = null
							delete currentState.imageStores[command.playerId]
							return currentState
						}
						return false
					})
				}
			}

			await kairos.updateImageStore(command.playerId, values)
			break
		}
		case 'sound-player':
			await kairos.updateAudioPlayer(command.playerId, command.values)
			break
		default:
			assertNever(command)
			throw new Error(`Unknown Kairos command type: ${commandType}`)
	}
}
