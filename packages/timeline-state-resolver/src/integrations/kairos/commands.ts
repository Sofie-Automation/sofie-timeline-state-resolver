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
	RamRecorderRef,
	ClipPlayerRef,
	KairosConnection,
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

	ref: ClipPlayerRef

	values: Partial<UpdateClipPlayerObject>
}

export interface KairosRamRecPlayerCommand {
	type: 'ram-rec-player'

	ref: RamRecorderRef

	values: Partial<UpdateClipPlayerObject>
}

export interface KairosStillPlayerCommand {
	type: 'still-player'

	ref: string // TODO - what should this be?

	clip: string // TODO - check
}

export interface KairosSoundPlayerCommand {
	type: 'sound-player'

	ref: string // TODO - what should this be?

	values: Partial<UpdateClipPlayerObject>
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
		case 'clip-player':
			await kairos.updateClipPlayer(command.ref, command.values)
			break
		case 'ram-rec-player':
			await kairos.updateRamRecorder(command.ref, command.values)
			break
		case 'still-player':
			await kairos.playStill(command.ref, command.clip)
			break
		case 'sound-player':
			await kairos.playSound(command.ref, command.values)
			break
		default:
			assertNever(command)
			throw new Error(`Unknown Kairos command type: ${commandType}`)
	}
}
