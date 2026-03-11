import { Mapping, MappingKairosType, Mappings, SomeMappingKairos } from 'timeline-state-resolver-types'
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
import { KairosCommandWithContext } from './commands.js'
import {
	AnyRef,
	assertNever,
	isRef,
	pathToRef,
	refAudioPlayer,
	refAuxName,
	refClipPlayer,
	refImageStore,
	refRamRecorder,
	refScene,
	refSceneLayer,
	refToPath,
} from 'kairos-connection'

/**
 * The goal of this module is to calculate a "dependency graph" of the Kairos state,
 * to determine what commands to send in which order.
 *
 * For example, if a state change involves
 * * Scene layer SCENES.Main.Layer.sourceA changing to "SCENES.Split"
 * * Scene layer SCENES.Split.Layer0.sourceA changing to "IP1"
 * * Scene layer SCENES.Split.Layer1.sourceA changing to "IP2"
 *
 * It is important that the commands are sent in the following order:
 * 1. Set SCENES.Split.Layer0.sourceA to IP1
 * 2. Set SCENES.Split.Layer1.sourceA to IP2
 * 3. Set SCENES.Main.Layer.sourceA to SCENES.Split
 *
 * If the command order is wrong, there is a risk that the split will be displayed with the wrong sources for a brief moment.
 */
export function temporalPriorityOrderCommands(
	newKairosState: KairosDeviceState,
	mappings: Mappings<SomeMappingKairos>,
	commands: KairosCommandWithContext[]
): KairosCommandWithContext[] {
	if (commands.length <= 1) return commands // Fast path

	const dependencyGraph = buildDependencyGraph(newKairosState, mappings)

	return orderCommandsByTemporalPriority(commands, dependencyGraph)
}

export function buildDependencyGraph(
	newKairosState: KairosDeviceState,
	mappings: Mappings<SomeMappingKairos>
): DependencyGraph {
	/** Maps ref -> DependencyGraphNode */
	const dependencyGraph: DependencyGraph = new Map()
	/** Set of nodes that we care about, to base the DependencyGraph upon */
	const baseNodeRefs = new Set<string>()

	// Start by populating the dependency graph with empty nodes:
	{
		const addNodeToDependencyGraph = (
			ref: AnyRef,
			sources0: (AnyRef | string | null | undefined)[]
		): DependencyGraphNode => {
			const sources: AnyRef[] = []
			for (const source of sources0) {
				if (source === null || source === undefined) continue
				if (typeof source === 'string') {
					const ref = pathToRef(source)
					if (isRef(ref)) sources.push(ref)
				} else {
					sources.push(source)
				}
			}
			const node: DependencyGraphNode = {
				sources: sources,
				ref: ref,
				iterationCount: 0,
			}
			dependencyGraph.set(refToPath(ref), node)
			return node
		}

		for (const obj of Object.values<KairosDeviceStateScenes>(newKairosState.scenes)) {
			if (!obj) continue
			// obj.state.nextTransition
			addNodeToDependencyGraph(obj.ref, [obj.state.keyPreview])
		}
		for (const obj of Object.values<KairosDeviceStateSceneSnapshots>(newKairosState.sceneSnapshots)) {
			if (!obj) continue
			addNodeToDependencyGraph(obj.ref, [])

			// Also populate Scene:
			const sceneRef = refScene(obj.ref.scenePath)
			let sceneNode = dependencyGraph.get(refToPath(sceneRef))
			if (!sceneNode) {
				sceneNode = addNodeToDependencyGraph(sceneRef, [])
			}
			sceneNode.sources.push(obj.ref)
		}
		for (const obj of Object.values<KairosDeviceStateSceneLayers>(newKairosState.sceneLayers)) {
			if (!obj) continue
			addNodeToDependencyGraph(obj.ref, [obj.state.sourceA, obj.state.sourcePgm, obj.state.sourcePst])

			// Also populate Scene:
			const sceneRef = refScene(obj.ref.scenePath)
			let sceneNode = dependencyGraph.get(refToPath(sceneRef))
			if (!sceneNode) {
				sceneNode = addNodeToDependencyGraph(sceneRef, [])
			}
			sceneNode.sources.push(obj.ref)
		}
		for (const obj of Object.values<KairosDeviceStateAux>(newKairosState.aux)) {
			if (!obj) continue
			addNodeToDependencyGraph(obj.ref, [obj.state.aux.source])
			// Add the AUX as base for temporal priority,
			// as AUXes are our "outputs".
			baseNodeRefs.add(refToPath(obj.ref))
		}
		for (const obj of Object.values<KairosDeviceStateMacros>(newKairosState.macros)) {
			if (!obj) continue
			addNodeToDependencyGraph(obj.ref, [])
		}

		for (const obj of Object.values<KairosDeviceStateImageStores>(newKairosState.imageStores)) {
			if (!obj) continue
			addNodeToDependencyGraph(refImageStore(obj.ref), [obj.state.content.imageStore.clip])
		}
		for (const obj of Object.values<KairosDeviceStateRamRecPlayers>(newKairosState.ramRecPlayers)) {
			if (!obj) continue
			addNodeToDependencyGraph(refRamRecorder(obj.ref), [obj.state.content.clip])
		}
		for (const obj of Object.values<KairosDeviceStateClipPlayers>(newKairosState.clipPlayers)) {
			if (!obj) continue
			addNodeToDependencyGraph(refClipPlayer(obj.ref), [obj.state.content.clip])
		}
		for (const obj of Object.values<KairosDeviceStateSoundPlayers>(newKairosState.soundPlayers)) {
			if (!obj) continue
			addNodeToDependencyGraph(refAudioPlayer(obj.ref), [obj.state.content.clip])
		}
	}

	// Consider temporalPriority from mappings:
	for (const mapping of Object.values<Mapping<SomeMappingKairos>>(mappings)) {
		if ('temporalPriority' in mapping.options) {
			let node: DependencyGraphNode | undefined
			if (mapping.options.mappingType === MappingKairosType.Aux) {
				node = dependencyGraph.get(refToPath(refAuxName(mapping.options.auxName)))
			} else if (mapping.options.mappingType === MappingKairosType.Scene) {
				node = dependencyGraph.get(refToPath(refScene(mapping.options.sceneName)))
			} else if (mapping.options.mappingType === MappingKairosType.SceneLayer) {
				node = dependencyGraph.get(
					refToPath(refSceneLayer(refScene(mapping.options.sceneName), mapping.options.layerName))
				)
			} else {
				assertNever(mapping.options)
				continue
			}

			if (node && mapping.options.temporalPriority !== undefined) {
				node.temporalPriority = mapping.options.temporalPriority
				// Since the user has set the temporalPriority for this node,
				// we'll add it as a base to include it when calculating dependencies.
				baseNodeRefs.add(refToPath(node.ref))
			}
		}
	}

	// Go through the baseNodeRefs and recursively go through their sources in the DependencyGraph,
	// assigning a "temporal priority" to each seen node
	{
		const MAX_ITERATIONS = 10 // To avoid infinite loops in case of circular dependencies
		const processNode = (node: DependencyGraphNode, currentPriority: number) => {
			node.iterationCount++

			const newTemporalPriority = Math.max(node.temporalPriority ?? -Infinity, currentPriority)
			let isModified = false
			if (node.temporalPriority !== newTemporalPriority) {
				node.temporalPriority = newTemporalPriority
				isModified = true
			}

			// Prevent infinite loops in case of circular dependencies:
			if (node.iterationCount > MAX_ITERATIONS) return

			if (isModified || node.iterationCount <= 1) {
				let childTemporalPriority = 0
				for (const sourceRef of node.sources) {
					const sourceNode = dependencyGraph.get(refToPath(sourceRef))
					if (!sourceNode) continue

					childTemporalPriority += 0.01
					processNode(sourceNode, newTemporalPriority + childTemporalPriority + 1)
				}
			}
		}
		for (const ref of baseNodeRefs.values()) {
			const node = dependencyGraph.get(ref)
			if (!node) continue
			// Note:
			// Nodes referenced in in baseNodeRefs have a default temporalPriority of 0,
			// (but it can be overridden by mappings to be either higher or lower).
			processNode(node, node.temporalPriority ?? 0)
		}
	}

	return dependencyGraph
}

type DependencyGraph = Map<string, DependencyGraphNode>
interface DependencyGraphNode {
	ref: AnyRef
	sources: AnyRef[]

	iterationCount: number
	temporalPriority?: number
}

export function orderCommandsByTemporalPriority(
	commands: KairosCommandWithContext[],
	dependencyGraph: DependencyGraph
): KairosCommandWithContext[] {
	const commandsWithPriority: { command: KairosCommandWithContext; temporalPriority: number }[] = commands.map(
		(command) => {
			let ref: AnyRef | undefined

			if (
				command.command.type === 'scene' ||
				command.command.type === 'scene-recall-snapshot' ||
				command.command.type === 'scene-layer' ||
				command.command.type === 'aux'
			) {
				ref = command.command.ref
			} else if (command.command.type === 'macro') {
				ref = command.command.macroRef
			} else if (command.command.type === 'clip-player') {
				ref = refClipPlayer(command.command.playerId)
			} else if (command.command.type === 'media-player:do') {
				if (command.command.playerType === 'clip-player') {
					ref = refClipPlayer(command.command.playerId)
				} else if (command.command.playerType === 'ram-rec-player') {
					ref = refRamRecorder(command.command.playerId)
				} else if (command.command.playerType === 'sound-player') {
					ref = refAudioPlayer(command.command.playerId)
				} else {
					ref = undefined
					assertNever(command.command.playerType)
				}
			} else if (command.command.type === 'ram-rec-player') {
				ref = refRamRecorder(command.command.playerId)
			} else if (command.command.type === 'sound-player') {
				ref = refAudioPlayer(command.command.playerId)
			} else if (command.command.type === 'image-store') {
				ref = refImageStore(command.command.playerId)
			} else {
				ref = undefined
				assertNever(command.command)
			}

			// Default value for commands without a temporalPriority is -Infinity to ensure that they are sorted last.
			// This is useful because the commands WITH a temporalPriority are known to be in the DependencyGraph, while ones without are not.
			// To exist in the dependencyGraph is equivalent to being "on air",
			// and we want the ones that are not to be executed last (for example when cutting away from a source we want the cut command to happen first and the source to linger).
			let temporalPriority = -Infinity

			if (ref) {
				// Look up the corresponding node in the dependency graph:
				const node = dependencyGraph.get(refToPath(ref))
				if (node?.temporalPriority !== undefined) {
					temporalPriority = node.temporalPriority
				}
			}

			return {
				command,
				temporalPriority,
			}
		}
	)

	commandsWithPriority.sort((a, b) => b.temporalPriority - a.temporalPriority) // Higher temporal priority first

	return commandsWithPriority.map((cmd) => cmd.command)
}
