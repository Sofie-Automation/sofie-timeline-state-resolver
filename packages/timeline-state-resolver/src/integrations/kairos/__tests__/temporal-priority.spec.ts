import {
	DeviceType,
	MappingKairosSceneLayer,
	MappingKairosType,
	Mappings,
	SomeMappingKairos,
	TimelineContentTypeKairos,
} from 'timeline-state-resolver-types'
import { makeDeviceTimelineStateObject } from '../../../__mocks__/objects.js'
import { KairosStateBuilder } from '../stateBuilder.js'
import {
	refAuxName,
	refClipPlayer,
	refIpInput,
	refMediaClip,
	refScene,
	refSceneLayer,
	refSourceBase,
	refToPath,
} from 'kairos-connection'
import { buildDependencyGraph, temporalPriorityOrderCommands } from '../temporal-priority.js'
import { diffKairosStates } from '../diffState.js'

describe('Temporal Priority', () => {
	test('Aux <- Scene <- Layer <- ClipPlayer', () => {
		// Defines a state where
		// * Aux "PGM" has as source Scene "Main"
		// * Scene "Main" has two layers: "Background" and "Overlay"
		// * Layer "Background" has as source IP input 1
		// * Layer "Overlay" has as source Clip Player 1
		// * Clip Player 1 is playing clip "video0.mp4"

		const Mappings: Mappings<SomeMappingKairos> = {
			aux1: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.Aux,
					auxName: 'PGM',
				},
			},
			mainSceneBackground: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Main'],
					layerName: ['Background'],
				},
			},
			mainSceneOverlay: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Main'],
					layerName: ['Overlay'],
				},
			},
			clipPlayer1: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.ClipPlayer,
					playerId: 1,
				},
			},
		}

		const state = KairosStateBuilder.fromTimeline(
			{
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'aux0_source',
						layer: 'aux1',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.AUX,
							aux: {
								source: refScene(['Main']),
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'mainSceneBackground_source',
						layer: 'mainSceneBackground',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refIpInput(1),
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'mainSceneOverlay_source',
						layer: 'mainSceneOverlay',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refClipPlayer(1),
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'video0.mp4',
						layer: 'clipPlayer1',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.CLIP_PLAYER,
							clipPlayer: {
								clip: refMediaClip(['video0.mp4']),
								playing: true,
							},
						},
					}),
				],
				time: 1,
			},
			Mappings
		)

		const dependencyGraph = buildDependencyGraph(state, Mappings)

		const refAux1 = refAuxName('PGM')
		const refSceneMain = refScene(['Main'])
		const refSceneLayerOverlay = refSceneLayer(refSceneMain, ['Overlay'])
		const refSceneLayerBackground = refSceneLayer(refSceneMain, ['Background'])
		const refClipPlayer1 = refClipPlayer(1)

		const priorityAux1 = dependencyGraph.get(refToPath(refAux1))?.temporalPriority
		const prioritySceneMain = dependencyGraph.get(refToPath(refSceneMain))?.temporalPriority
		const prioritySceneLayerOverlay = dependencyGraph.get(refToPath(refSceneLayerOverlay))?.temporalPriority
		const prioritySceneLayerBackground = dependencyGraph.get(refToPath(refSceneLayerBackground))?.temporalPriority
		const priorityClipPlayer1 = dependencyGraph.get(refToPath(refClipPlayer1))?.temporalPriority

		// Sanity check, no priorities should be undefined:
		if (priorityAux1 === undefined) throw new Error('Expected value to be defined')
		if (prioritySceneMain === undefined) throw new Error('Expected value to be defined')
		if (prioritySceneLayerOverlay === undefined) throw new Error('Expected value to be defined')
		if (prioritySceneLayerBackground === undefined) throw new Error('Expected value to be defined')
		if (priorityClipPlayer1 === undefined) throw new Error('Expected value to be defined')

		// Check that the priorities are in expected order (higher number means higher priority, so should be prepared first):
		expect(priorityClipPlayer1).toBeGreaterThan(prioritySceneLayerOverlay) // Prepare Clip Player before Scene Layer that uses it
		expect(prioritySceneLayerOverlay).toBeGreaterThan(prioritySceneMain) // Prepare Scene Layer before Scene
		expect(prioritySceneLayerBackground).toBeGreaterThan(prioritySceneMain) // Prepare Scene Layer before Scene
		expect(prioritySceneMain).toBeGreaterThan(priorityAux1) // Prepare Scene before Aux that uses it

		const unorderedCommands = diffKairosStates(
			KairosStateBuilder.fromTimeline(
				{
					objects: [],
					time: 0,
				},
				Mappings
			),
			state,
			Mappings
		)

		const commands = temporalPriorityOrderCommands(state, Mappings, unorderedCommands)

		// Ensure that the commands are in the expected order based on their dependencies,
		expect(commands.map((c) => c.command)).toStrictEqual([
			// Load a clip:
			{
				type: 'clip-player',
				playerId: 1,
				values: { clip: { realm: 'media-clip', clipPath: ['video0.mp4'] }, repeat: false },
			},
			// Play the clip:
			{ type: 'media-player:do', playerId: 1, playerType: 'clip-player', command: 'play' },

			// Set the clip player as source to the scene layer:
			{
				type: 'scene-layer',
				ref: { realm: 'scene-layer', scenePath: ['Main'], layerPath: ['Overlay'] },
				sceneLayerId: 'SCENES.Main.Layers.Overlay',
				values: { sourceA: { realm: 'clipPlayer', playerIndex: 1 } },
			},
			// Set the ip-input as source to the scene layer:
			{
				type: 'scene-layer',
				ref: { realm: 'scene-layer', scenePath: ['Main'], layerPath: ['Background'] },
				sceneLayerId: 'SCENES.Main.Layers.Background',
				values: { sourceA: { realm: 'ip-input', ipInput: 1 } },
			},
			// Set the scene as source to the aux:
			{
				type: 'aux',
				ref: { realm: 'aux', path: 'PGM', pathIsName: true },
				values: { source: { realm: 'scene', scenePath: ['Main'] } },
			},
		])
	})
	test('Aux <- Scene <- Layer <- Scene(split) <- Layer', () => {
		// Defines a state where initially
		// * Aux "PGM" has as source Scene "Main"
		// * Scene "Main" has a Background layer
		// * The Background layer displays IP1
		//
		// Then we switch to a "Split" layout:
		// * The Background layer displays Scene "Split"
		// * Scene "Split" has two layers: "Left" and "Right"
		// * Layer "Left" has as source IP1
		// * Layer "Right" has as source IP2

		const Mappings: Mappings<SomeMappingKairos> = {
			aux1: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.Aux,
					auxName: 'PGM',
				},
			},
			mainSceneBackground: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Main'],
					layerName: ['Background'],
				},
			},
			splitSceneRight: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Split'],
					layerName: ['Right'],
				},
			},
			splitSceneLeft: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Split'],
					layerName: ['Left'],
				},
			},
		}

		const refAux1 = refAuxName('PGM')
		const refSceneMain = refScene(['Main'])
		const refSceneSplit = refScene(['Split'])
		const refSceneLayerMainBackground = refSceneLayer(refSceneMain, ['Background'])
		const refSceneLayerSplitLeft = refSceneLayer(refSceneSplit, ['Left'])
		const refSceneLayerSplitRight = refSceneLayer(refSceneSplit, ['Right'])

		const initialState = KairosStateBuilder.fromTimeline(
			{
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'aux0_source',
						layer: 'aux1',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.AUX,
							aux: {
								source: refSceneMain,
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'mainSceneBackground_source',
						layer: 'mainSceneBackground',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refIpInput(1),
							},
						},
					}),
				],
				time: 1,
			},
			Mappings
		)
		const splitState = KairosStateBuilder.fromTimeline(
			{
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'aux0_source',
						layer: 'aux1',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.AUX,
							aux: {
								source: refSceneMain,
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'mainSceneBackground_source',
						layer: 'mainSceneBackground',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refSceneSplit,
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'splitSceneLeft',
						layer: 'splitSceneLeft',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refIpInput(1),
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'splitSceneRight',
						layer: 'splitSceneRight',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refIpInput(2),
							},
						},
					}),
				],
				time: 1,
			},
			Mappings
		)

		const dependencyGraph = buildDependencyGraph(splitState, Mappings)

		const priorityAux1 = dependencyGraph.get(refToPath(refAux1))?.temporalPriority
		const prioritySceneLayerMainBackground = dependencyGraph.get(
			refToPath(refSceneLayerMainBackground)
		)?.temporalPriority
		const prioritySceneLayerSplitLeft = dependencyGraph.get(refToPath(refSceneLayerSplitLeft))?.temporalPriority
		const prioritySceneLayerSplitRight = dependencyGraph.get(refToPath(refSceneLayerSplitRight))?.temporalPriority

		// Sanity check, no priorities should be undefined:
		if (priorityAux1 === undefined) throw new Error('Expected value to be defined')
		if (prioritySceneLayerMainBackground === undefined) throw new Error('Expected value to be defined')
		if (prioritySceneLayerSplitLeft === undefined) throw new Error('Expected value to be defined')
		if (prioritySceneLayerSplitRight === undefined) throw new Error('Expected value to be defined')

		// Check that the priorities are in expected order (higher number means higher priority, so should be prepared first):
		expect(prioritySceneLayerSplitLeft).toBeGreaterThan(prioritySceneLayerMainBackground) // Prepare Split content before Main content in the layer that uses it
		expect(prioritySceneLayerSplitRight).toBeGreaterThan(prioritySceneLayerMainBackground) // Prepare Split content before Main content in the layer that uses it
		expect(prioritySceneLayerMainBackground).toBeGreaterThan(priorityAux1) // Prepare Split before Main that uses it

		const unorderedCommands = diffKairosStates(initialState, splitState, Mappings)

		const commands = temporalPriorityOrderCommands(splitState, Mappings, unorderedCommands)

		// Ensure that the commands are in the expected order based on their dependencies,
		expect(commands.map((c) => c.command)).toStrictEqual([
			// Prepare split content first:
			{
				type: 'scene-layer',
				ref: { realm: 'scene-layer', scenePath: ['Split'], layerPath: ['Right'] },
				sceneLayerId: 'SCENES.Split.Layers.Right',
				values: { sourceA: { realm: 'ip-input', ipInput: 2 } },
			},
			// Prepare split content first:
			{
				type: 'scene-layer',
				ref: { realm: 'scene-layer', scenePath: ['Split'], layerPath: ['Left'] },
				sceneLayerId: 'SCENES.Split.Layers.Left',
				values: { sourceA: { realm: 'ip-input', ipInput: 1 } },
			},
			// Then switch to the split scene:
			{
				type: 'scene-layer',
				ref: { realm: 'scene-layer', scenePath: ['Main'], layerPath: ['Background'] },
				sceneLayerId: 'SCENES.Main.Layers.Background',
				values: { sourceA: { realm: 'scene', scenePath: ['Split'] } },
			},
		])
	})
	test('Go away from Split', () => {
		// Defines a state where initially
		// We are on a "Split" layout:
		// * Aux "PGM" has as source Scene "Main"
		// * Scene "Main" has a Background layer
		// * The Background layer displays Scene "Split"
		// * Scene "Split" has two layers: "Left" and "Right"
		// * Layer "Left" has as source IP1
		// * Layer "Right" has as source IP2
		//
		// Then we switch away from the "Split" layout:
		// * The Main.Background layer switches to IP1
		// * Split scene is cleared (-> BLACK)

		const Mappings: Mappings<SomeMappingKairos> = {
			aux1: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.Aux,
					auxName: 'PGM',
				},
			},
			mainSceneBackground: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Main'],
					layerName: ['Background'],
				},
			},
			splitSceneRight: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Split'],
					layerName: ['Right'],
				},
			},
			splitSceneLeft: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Split'],
					layerName: ['Left'],
				},
			},
		}

		const refSceneMain = refScene(['Main'])
		const refSceneSplit = refScene(['Split'])

		const splitState = KairosStateBuilder.fromTimeline(
			{
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'aux0_source',
						layer: 'aux1',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.AUX,
							aux: {
								source: refSceneMain,
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'mainSceneBackground_source',
						layer: 'mainSceneBackground',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refSceneSplit,
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'splitSceneLeft',
						layer: 'splitSceneLeft',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refIpInput(1),
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'splitSceneRight',
						layer: 'splitSceneRight',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refIpInput(2),
							},
						},
					}),
				],
				time: 1,
			},
			Mappings
		)
		const newState = KairosStateBuilder.fromTimeline(
			{
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'aux0_source',
						layer: 'aux1',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.AUX,
							aux: {
								source: refSceneMain,
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'mainSceneBackground_source',
						layer: 'mainSceneBackground',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refIpInput(1),
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'splitSceneLeft',
						layer: 'splitSceneLeft',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refSourceBase(['BLACK']),
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'splitSceneRight',
						layer: 'splitSceneRight',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refSourceBase(['BLACK']),
							},
						},
					}),
				],
				time: 1,
			},
			Mappings
		)

		const unorderedCommands = diffKairosStates(splitState, newState, Mappings)

		const commands = temporalPriorityOrderCommands(newState, Mappings, unorderedCommands)

		// Ensure that the commands are in the expected order based on their dependencies,
		expect(commands.map((c) => c.command)).toStrictEqual([
			// Cut away from the split first:
			// This important to do first, otherwise we might display the split with BLACK content for a brief moment
			{
				type: 'scene-layer',
				ref: { realm: 'scene-layer', scenePath: ['Main'], layerPath: ['Background'] },
				sceneLayerId: 'SCENES.Main.Layers.Background',
				values: { sourceA: { realm: 'ip-input', ipInput: 1 } },
			},
			// Then update split content:
			{
				type: 'scene-layer',
				ref: { realm: 'scene-layer', scenePath: ['Split'], layerPath: ['Left'] },
				sceneLayerId: 'SCENES.Split.Layers.Left',
				values: { sourceA: { realm: 'source-base', path: ['BLACK'] } },
			},
			// Then update split content:
			{
				type: 'scene-layer',
				ref: { realm: 'scene-layer', scenePath: ['Split'], layerPath: ['Right'] },
				sceneLayerId: 'SCENES.Split.Layers.Right',
				values: { sourceA: { realm: 'source-base', path: ['BLACK'] } },
			},
		])
	})
	test('Mapping temporalPriority', () => {
		// Defines a state where:
		// * The Scene1.Content layer displays Scene "Split"
		// * The Scene2.Content layer displays Scene "Split"
		// * The Scene3.Content layer displays Scene "Split"
		// * The Split.Content layer displays IP1

		// Tests how command order is affected by mapping.temporalPriority
		// Note that there is no AUX defined in this test

		const Mappings: Mappings<MappingKairosSceneLayer> = {
			scene1Content: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Scene1'],
					layerName: ['Content'],
				},
			},
			scene2Content: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Scene2'],
					layerName: ['Content'],
				},
			},
			scene3Content: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Scene3'],
					layerName: ['Content'],
				},
			},
			splitSceneContent: {
				device: DeviceType.KAIROS,
				deviceId: 'kairos0',
				options: {
					mappingType: MappingKairosType.SceneLayer,
					sceneName: ['Split'],
					layerName: ['Content'],
				},
			},
		}

		const refSceneSplit = refScene(['Split'])

		const EMPTY_STATE = KairosStateBuilder.fromTimeline(
			{
				objects: [],
				time: 0,
			},
			Mappings
		)

		const state = KairosStateBuilder.fromTimeline(
			{
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'scene1Content',
						layer: 'scene1Content',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refSceneSplit,
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'scene2Content',
						layer: 'scene2Content',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refSceneSplit,
							},
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'scene3Content',
						layer: 'scene3Content',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refSceneSplit,
							},
						},
					}),

					makeDeviceTimelineStateObject({
						enable: { start: 1 },
						id: 'splitSceneContent',
						layer: 'splitSceneContent',
						content: {
							deviceType: DeviceType.KAIROS,
							type: TimelineContentTypeKairos.SCENE_LAYER,
							sceneLayer: {
								sourceA: refIpInput(1),
							},
						},
					}),
				],
				time: 1,
			},
			Mappings
		)

		{
			// Test what happens when scene2 temporalPriority is set to something high
			Mappings.scene2Content.options.temporalPriority = 1000

			const commands = temporalPriorityOrderCommands(state, Mappings, diffKairosStates(EMPTY_STATE, state, Mappings))

			// Ensure that the commands are in the expected order based on their dependencies,
			expect(commands.map((c) => c.command)).toStrictEqual([
				// Scene2 has high temporalPriority, so it (and it's dependents) should be prepared first
				{
					type: 'scene-layer',
					ref: { realm: 'scene-layer', scenePath: ['Split'], layerPath: ['Content'] },
					sceneLayerId: 'SCENES.Split.Layers.Content',
					values: { sourceA: { realm: 'ip-input', ipInput: 1 } },
				},
				{
					type: 'scene-layer',
					ref: { realm: 'scene-layer', scenePath: ['Scene2'], layerPath: ['Content'] },
					sceneLayerId: 'SCENES.Scene2.Layers.Content',
					values: { sourceA: { realm: 'scene', scenePath: ['Split'] } },
				},

				// The other scenes has no temporalPriority, so they are executed last:
				{
					type: 'scene-layer',
					ref: { realm: 'scene-layer', scenePath: ['Scene1'], layerPath: ['Content'] },
					sceneLayerId: 'SCENES.Scene1.Layers.Content',
					values: { sourceA: { realm: 'scene', scenePath: ['Split'] } },
				},
				{
					type: 'scene-layer',
					ref: { realm: 'scene-layer', scenePath: ['Scene3'], layerPath: ['Content'] },
					sceneLayerId: 'SCENES.Scene3.Layers.Content',
					values: { sourceA: { realm: 'scene', scenePath: ['Split'] } },
				},
			])

			// End:
			delete Mappings.scene2Content.options.temporalPriority
		}

		{
			// Test what happens when scene2 temporalPriority is set to something high and scene3 is set to something low
			Mappings.scene2Content.options.temporalPriority = 1000
			Mappings.scene3Content.options.temporalPriority = -1000

			const commands = temporalPriorityOrderCommands(state, Mappings, diffKairosStates(EMPTY_STATE, state, Mappings))

			// Ensure that the commands are in the expected order based on their dependencies,
			expect(commands.map((c) => c.command)).toStrictEqual([
				// Scene2 has high temporalPriority, so it (and it's dependents) should be prepared first
				// Scene3 has low temporalPriority, but that still qualifies it to be executed before Scene1 that has no temporalPriority at all

				// Split is prepared first:
				{
					type: 'scene-layer',
					ref: { realm: 'scene-layer', scenePath: ['Split'], layerPath: ['Content'] },
					sceneLayerId: 'SCENES.Split.Layers.Content',
					values: { sourceA: { realm: 'ip-input', ipInput: 1 } },
				},
				// Then Scene2 (high temporalPriority):
				{
					type: 'scene-layer',
					ref: { realm: 'scene-layer', scenePath: ['Scene2'], layerPath: ['Content'] },
					sceneLayerId: 'SCENES.Scene2.Layers.Content',
					values: { sourceA: { realm: 'scene', scenePath: ['Split'] } },
				},
				// Then Scene3 (low temporalPriority):
				{
					type: 'scene-layer',
					ref: { realm: 'scene-layer', scenePath: ['Scene3'], layerPath: ['Content'] },
					sceneLayerId: 'SCENES.Scene3.Layers.Content',
					values: { sourceA: { realm: 'scene', scenePath: ['Split'] } },
				},

				// Then the ones with no temporalPriority
				{
					type: 'scene-layer',
					ref: { realm: 'scene-layer', scenePath: ['Scene1'], layerPath: ['Content'] },
					sceneLayerId: 'SCENES.Scene1.Layers.Content',
					values: { sourceA: { realm: 'scene', scenePath: ['Split'] } },
				},
			])

			// End:
			delete Mappings.scene2Content.options.temporalPriority
			delete Mappings.scene3Content.options.temporalPriority
		}
	})
})
