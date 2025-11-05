import type { SomeMappingKairos, Mappings } from 'timeline-state-resolver-types'
import { KairosMacroActiveState } from 'timeline-state-resolver-types'
import { KairosStateBuilder, type KairosDeviceState } from './stateBuilder'
import type { KairosCommandWithContext } from '.'
// eslint-disable-next-line node/no-missing-import
import { UpdateSceneLayerObject, UpdateSceneObject, UpdateAuxObject } from 'kairos-connection'

import { diffMediaPlayers, diffMediaImageStore as diffMediaImageStore } from './diffState/media-players'
import { diffObject, getAllKeysString } from './diffState/lib'

export function diffKairosStates(
	oldKairosState: KairosDeviceState | undefined,
	newKairosState: KairosDeviceState,
	mappings: Mappings<SomeMappingKairos>
): KairosCommandWithContext[] {
	// Make sure there is something to diff against
	oldKairosState =
		oldKairosState ??
		KairosStateBuilder.fromTimeline(
			{
				time: 0,
				objects: [],
			},
			mappings
		)

	const commands: KairosCommandWithContext[] = []

	// TODO - any concerns with temporal order (ie, cutting to/from a clip player before it has started/stopped playing?)

	commands.push(...diffSceneSnapshots(oldKairosState.sceneSnapshots, newKairosState.sceneSnapshots))
	commands.push(...diffScenes(oldKairosState.scenes, newKairosState.scenes))
	commands.push(...diffSceneLayers(oldKairosState.sceneLayers, newKairosState.sceneLayers))

	commands.push(...diffAuxes(oldKairosState.aux, newKairosState.aux))

	commands.push(...diffMacros(oldKairosState.macros, newKairosState.macros))

	commands.push(
		...diffMediaPlayers(newKairosState.stateTime, 'clip-player', oldKairosState.clipPlayers, newKairosState.clipPlayers)
	)
	commands.push(
		...diffMediaPlayers(
			newKairosState.stateTime,
			'ram-rec-player',
			oldKairosState.ramRecPlayers,
			newKairosState.ramRecPlayers
		)
	)
	commands.push(
		...diffMediaPlayers(
			newKairosState.stateTime,
			'sound-player',
			oldKairosState.soundPlayers,
			newKairosState.soundPlayers
		)
	)
	commands.push(...diffMediaImageStore(oldKairosState.imageStores, newKairosState.imageStores))

	return commands
}

// const SceneDefaults: UpdateSceneObject = {
// 	advancedResolutionControl: false,
// }

function diffScenes(
	oldScenes: KairosDeviceState['scenes'],
	newScenes: KairosDeviceState['scenes']
): KairosCommandWithContext[] {
	const commands: KairosCommandWithContext[] = []

	const sceneKeys = getAllKeysString(oldScenes, newScenes)
	for (const sceneKey of sceneKeys) {
		const newScene = newScenes[sceneKey]
		const oldScene = oldScenes[sceneKey]

		const sceneRef = newScene?.ref || oldScene?.ref
		if (!sceneRef) continue // No scene to diff

		// const oldSceneState: UpdateSceneObject = { ...SceneDefaults, ...oldScene?.state }
		// const newSceneState: UpdateSceneObject = { ...SceneDefaults, ...newScene?.state }

		const diff = diffObject<UpdateSceneObject>(oldScene?.state, newScene?.state)
		if (diff) {
			commands.push({
				timelineObjId: newScene?.timelineObjIds.join(' & ') ?? '',
				context: `sceneKey=${sceneKey} newScene=${!!newScene} oldScene=${!!oldScene}`,
				command: {
					type: 'scene',
					ref: sceneRef,
					values: diff,
				},
			})
		}
	}

	return commands
}
function diffSceneLayers(
	oldSceneLayers: KairosDeviceState['sceneLayers'],
	newSceneLayers: KairosDeviceState['sceneLayers']
): KairosCommandWithContext[] {
	const commands: KairosCommandWithContext[] = []

	const sceneLayerKeys = getAllKeysString(oldSceneLayers, newSceneLayers)
	for (const sceneLayerKey of sceneLayerKeys) {
		const newSceneLayer = newSceneLayers[sceneLayerKey]
		const oldSceneLayer = oldSceneLayers[sceneLayerKey]

		const sceneLayerRef = newSceneLayer?.ref || oldSceneLayer?.ref
		if (!sceneLayerRef) continue // No scene to diff

		// const oldSceneState: UpdateSceneObject = { ...SceneDefaults, ...oldScene?.state }
		// const newSceneState: UpdateSceneObject = { ...SceneDefaults, ...newScene?.state }

		const diff = diffObject<UpdateSceneLayerObject>(oldSceneLayer?.state, newSceneLayer?.state)
		if (diff) {
			commands.push({
				timelineObjId: newSceneLayer?.timelineObjIds.join(' & ') ?? '',
				context: `sceneLayerKey=${sceneLayerKey} newSceneLayer=${!!newSceneLayer} oldSceneLayer=${!!oldSceneLayer}`,
				command: {
					type: 'scene-layer',
					ref: sceneLayerRef,
					values: diff,
				},
			})
		}
	}

	return commands
}

function diffSceneSnapshots(
	oldSceneSnapshots: KairosDeviceState['sceneSnapshots'],
	newSceneSnapshots: KairosDeviceState['sceneSnapshots']
): KairosCommandWithContext[] {
	const commands: KairosCommandWithContext[] = []

	const sceneSnapshotKeys = getAllKeysString(oldSceneSnapshots, newSceneSnapshots)
	for (const sceneSnapshotKey of sceneSnapshotKeys) {
		const newSceneSnapshot = newSceneSnapshots[sceneSnapshotKey]
		const oldSceneSnapshot = oldSceneSnapshots[sceneSnapshotKey]

		const sceneSnapshotRef = newSceneSnapshot?.ref || oldSceneSnapshot?.ref
		if (!sceneSnapshotRef) continue // No scene snapshot to diff

		// Check if active state changed
		const oldActive = oldSceneSnapshot?.state.active ?? undefined
		const newActive = newSceneSnapshot?.state.active ?? undefined

		if (oldActive !== newActive) {
			commands.push({
				timelineObjId: newSceneSnapshot?.timelineObjIds.join(' & ') ?? '',
				context: `sceneSnapshotKey=${sceneSnapshotKey} newSceneSnapshot=${!!newSceneSnapshot} oldSceneSnapshot=${!!oldSceneSnapshot}`,
				command: {
					type: 'scene-recall-snapshot',
					ref: sceneSnapshotRef,
					snapshotName: sceneSnapshotKey,
					active: newActive,
				},
			})
		}
	}

	return commands
}

function diffAuxes(oldAuxes: KairosDeviceState['aux'], newAuxes: KairosDeviceState['aux']): KairosCommandWithContext[] {
	const commands: KairosCommandWithContext[] = []

	const auxKeys = getAllKeysString(oldAuxes, newAuxes)
	for (const auxKey of auxKeys) {
		const newAux = newAuxes[auxKey]
		const oldAux = oldAuxes[auxKey]

		const auxRef = newAux?.ref || oldAux?.ref
		if (!auxRef) continue // No aux to diff

		const diff = diffObject<UpdateAuxObject>(oldAux?.state.aux, newAux?.state.aux)
		if (diff) {
			commands.push({
				timelineObjId: newAux?.timelineObjIds.join(' & ') ?? '',
				context: `auxKey=${auxKey} newAux=${!!newAux} oldAux=${!!oldAux}`,
				command: {
					type: 'aux',
					ref: auxRef,
					values: diff,
				},
			})
		}
	}

	return commands
}

function diffMacros(
	oldMacros: KairosDeviceState['macros'],
	newMacros: KairosDeviceState['macros']
): KairosCommandWithContext[] {
	const commands: KairosCommandWithContext[] = []

	const macroKeys = getAllKeysString(oldMacros, newMacros)
	for (const macroKey of macroKeys) {
		const newMacro = newMacros[macroKey]
		const oldMacro = oldMacros[macroKey]

		const macroRef = newMacro?.ref || oldMacro?.ref
		if (!macroRef) continue // No macro to diff

		// Check if active state changed
		const oldActive = oldMacro?.state.active
		const newActive = newMacro?.state.active

		if (oldActive !== newActive && newActive !== undefined && newActive !== KairosMacroActiveState.UNCHANGED) {
			commands.push({
				timelineObjId: newMacro?.timelineObjIds.join(' & ') ?? '',
				context: `macroKey=${macroKey} newMacro=${!!newMacro} oldMacro=${!!oldMacro}`,
				command: {
					type: 'macro',
					macroName: macroKey,
					macroRef: macroRef,
					active: newActive === KairosMacroActiveState.PLAYING,
				},
			})
		}
	}

	return commands
}
