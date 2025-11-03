import type {
	UpdateSceneObject,
	UpdateSceneLayerObject,
	UpdateAuxObject,
	UpdateClipPlayerObject,
	SceneRef,
	SceneLayerRef,
	AuxRef,
	MacroRef,
	SceneSnapshotRef,
	KairosConnection,
	UpdateRamRecPlayerObject,
	UpdateAudioPlayerObject,
	UpdateImageStoreObject,
	// eslint-disable-next-line node/no-missing-import
} from 'kairos-connection'
import { assertNever } from '../../lib'

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
	active: boolean
}

export interface KairosSceneLayerCommand {
	type: 'scene-layer'

	ref: SceneLayerRef

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

export async function sendCommand(kairos: KairosConnection, command: KairosCommandAny): Promise<void> {
	const commandType = command.type
	switch (command.type) {
		case 'scene':
			await kairos.updateScene(command.ref, command.values)
			break
		case 'scene-recall-snapshot':
			if (command.active) {
				await kairos.sceneSnapshotRecall(command.ref)
			} else {
				await kairos.sceneSnapshotAbort(command.ref)
			}
			break
		case 'scene-layer':
			await kairos.updateSceneLayer(command.ref, command.values)
			break
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
			if (command.values.clip) {
				await kairos.loadClipPlayerClip(command.playerId, command.values.clip, command.values.position)
				delete command.values.clip
				delete command.values.position
			}
			await kairos.updateClipPlayer(command.playerId, command.values)
			break
		}
		case 'media-player:do': {
			switch (command.command) {
				case 'begin': {
					if (command.playerType === 'clip-player') await kairos.clipPlayerBegin(command.playerId)
					else if (command.playerType === 'ram-rec-player') await kairos.ramRecorderBegin(command.playerId)
					else if (command.playerType === 'sound-player') await kairos.audioPlayerBegin(command.playerId)
					else if (command.playerType === 'image-store') await kairos.audioPlayerBegin(command.playerId)
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
		case 'ram-rec-player':
			await kairos.updateRamRecorder(command.playerId, command.values)
			break
		case 'image-store':
			await kairos.updateImageStore(command.playerId, command.values)
			break
		case 'sound-player':
			await kairos.updateAudioPlayer(command.playerId, command.values)
			break
		default:
			assertNever(command)
			throw new Error(`Unknown Kairos command type: ${commandType}`)
	}
}
