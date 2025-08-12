import type { SomeMappingKairos, Mappings } from 'timeline-state-resolver-types'
import { KairosStateBuilder, type KairosDeviceState } from './stateBuilder'
import type { KairosCommandWithContext } from '.'
// eslint-disable-next-line node/no-missing-import
import { UpdateSceneLayerObject, UpdateSceneObject } from 'kairos-connection'
import { isEqual } from 'underscore'

export function diffKairosStates(
	oldKairosState: KairosDeviceState | undefined,
	newKairosState: KairosDeviceState,
	mappings: Mappings<SomeMappingKairos>
): KairosCommandWithContext[] {
	// Make sure there is something to diff against
	oldKairosState = oldKairosState ?? KairosStateBuilder.fromTimeline({}, mappings)

	const commands: KairosCommandWithContext[] = []

	// TODO - any concerns with temporal order (ie, cutting to/from a clip player before it has started/stopped playing?)

	// TODO - should this act more like atem-state where anything unset gets restored to a hardcoded 'default', or should it only set properties which are explicitly set/diff on the timeline?
	// I almost did the latter, but then I realized that it would be hard to do anything. You would need to have a 'defaults' baseline object to set the default state, otherwise it wouldnt be
	// repected when going between two timed objects. eg baseline: { a: 1, b: 2 }, object A: { a: 3, b: 3 } and object B: { a: 4 }.
	// when going A -> B, it wouldnt know to set b to 2, because that wouldnt be present in the timeline. Depending what the property is, that may be fine or not.

	// commands.push(...diffSceneSnapshots(oldKairosState.sceneSnapshots, newKairosState.sceneSnapshots))
	commands.push(...diffScenes(oldKairosState.scenes, newKairosState.scenes))
	commands.push(...diffSceneLayers(oldKairosState.sceneLayers, newKairosState.sceneLayers))

	// commands.push(...diffAuxes(oldKairosState.aux, newKairosState.aux))

	// commands.push(...diffMacros(oldKairosState.macros, newKairosState.macros))

	// commands.push(...diffClipPlayers(oldKairosState.clipPlayers, newKairosState.clipPlayers))
	// commands.push(...diffRamRecPlayers(oldKairosState.ramRecPlayers, newKairosState.ramRecPlayers))
	// commands.push(...diffStillPlayers(oldKairosState.stillPlayers, newKairosState.stillPlayers))
	// commands.push(...diffSoundPlayers(oldKairosState.soundPlayers, newKairosState.soundPlayers))

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

function diffObject<T>(oldObj: Partial<T> | undefined, newObj: Partial<T> | undefined): Partial<T> | undefined {
	if (!newObj) return undefined

	const diff: Partial<T> = {}
	let hasChange = false

	for (const key in newObj) {
		const typedKey = key as keyof T
		if (newObj[typedKey] !== undefined && !isEqual(newObj[typedKey], oldObj?.[typedKey])) {
			hasChange = true
			diff[typedKey] = newObj[typedKey]
		}
	}

	return hasChange ? diff : undefined
}

function keyIsValid(key: string, oldObj: any, newObj: any) {
	const oldVal = oldObj[key]
	const newVal = newObj[key]
	return (oldVal !== undefined && oldVal !== null) || (newVal !== undefined && newVal !== null)
}
function getAllKeysString<V>(
	oldObj0: { [key: string]: V } | undefined,
	newObj0: { [key: string]: V } | undefined
): string[] {
	const oldObj = oldObj0 ?? {}
	const newObj = newObj0 ?? {}
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i)
}
function getAllKeysNumber<V>(
	oldObj0: { [key: number]: V } | Array<V> | undefined,
	newObj0: { [key: number]: V } | Array<V> | undefined
): number[] {
	const oldObj = oldObj0 ?? []
	const newObj = newObj0 ?? []
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i).map((v) => parseInt(v, 10))
}
