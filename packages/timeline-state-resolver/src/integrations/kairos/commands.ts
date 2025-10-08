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
	| KairosClipPlayerCommandMethod
	| KairosRamRecPlayerCommand
	| KairosStillPlayerCommand
	| KairosSoundPlayerCommand

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
export interface KairosClipPlayerCommandMethod {
	type: 'clip-player:do'
	playerId: number
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

export interface KairosStillPlayerCommand {
	type: 'still-player'

	playerId: number

	values: null // TODO
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
		case 'clip-player:do': {
			switch (command.command) {
				case 'begin':
					await kairos.clipPlayerBegin(command.playerId)
					break
				case 'rewind':
					await kairos.clipPlayerRewind(command.playerId)
					break
				case 'stepBack':
					await kairos.clipPlayerStepBack(command.playerId)
					break
				case 'reverse':
					await kairos.clipPlayerReverse(command.playerId)
					break
				case 'play':
					await kairos.clipPlayerPlay(command.playerId)
					break
				case 'pause':
					await kairos.clipPlayerPause(command.playerId)
					break
				case 'stop':
					await kairos.clipPlayerStop(command.playerId)
					break
				case 'stepForward':
					await kairos.clipPlayerStepForward(command.playerId)
					break
				case 'fastForward':
					await kairos.clipPlayerFastForward(command.playerId)
					break
				case 'end':
					await kairos.clipPlayerEnd(command.playerId)
					break
				case 'playlistBegin':
					await kairos.clipPlayerPlaylistBegin(command.playerId)
					break
				case 'playlistBack':
					await kairos.clipPlayerPlaylistBack(command.playerId)
					break
				case 'playlistNext':
					await kairos.clipPlayerPlaylistNext(command.playerId)
					break
				case 'playlistEnd':
					await kairos.clipPlayerPlaylistEnd(command.playerId)
					break
				default:
					assertNever(command.command)
					throw new Error(`Unknown Kairos command.command type: ${command.command}`)
			}

			break
		}

		case 'ram-rec-player':
			await kairos.updateRamRecorder(command.playerId, command.values)
			break
		case 'still-player':
			// TODO - not implemented
			// await kairos.(command.ref, command.clip)
			break
		case 'sound-player':
			await kairos.updateAudioPlayer(command.playerId, command.values)
			break
		default:
			assertNever(command)
			throw new Error(`Unknown Kairos command type: ${commandType}`)
	}
}
