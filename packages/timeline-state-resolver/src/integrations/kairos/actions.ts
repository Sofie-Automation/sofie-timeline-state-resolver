import {
	KairosConnection,
	refScene,
	refSceneLayer,
	refMacro,
	refAuxName,
	refAuxId,
	refGfxScene,
	refSceneSnapshot,
	// eslint-disable-next-line node/no-missing-import
} from 'kairos-connection'
import { ActionExecutionResultCode, KairosActionMethods, KairosActions } from 'timeline-state-resolver-types'

export function getActions(kairos: KairosConnection): KairosActionMethods {
	return {
		[KairosActions.ListScenes]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listScenes(refScene(payload.scenePath), payload.deep),
				resultCode: 0,
			}
		},
		[KairosActions.ListSceneLayers]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listSceneLayers(
					refSceneLayer(refScene(payload.scenePath), payload.layerPath),
					payload.deep
				),
				resultCode: 0,
			}
		},
		[KairosActions.ListSceneLayerEffects]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listSceneLayerEffects(
					refSceneLayer(refScene(payload.scenePath), payload.layerPath),
					payload.deep
				),
				resultCode: 0,
			}
		},
		[KairosActions.ListSceneTransitions]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listSceneTransitions(refScene(payload.scenePath)),
				resultCode: 0,
			}
		},
		[KairosActions.ListSceneSnapshots]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listSceneSnapshots(refScene(payload.scenePath)),
				resultCode: 0,
			}
		},
		[KairosActions.ListFxInputs]: async (_payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listFxInputs(),
				resultCode: 0,
			}
		},
		[KairosActions.ListMattes]: async (_payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listMattes(),
				resultCode: 0,
			}
		},
		[KairosActions.ListMediaClips]: async (_payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listMediaClips(),
				resultCode: 0,
			}
		},
		[KairosActions.ListMediaStills]: async (_payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listMediaStills(),
				resultCode: 0,
			}
		},
		[KairosActions.ListMediaRamRec]: async (_payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listMediaRamRecs(),
				resultCode: 0,
			}
		},
		[KairosActions.ListMediaImage]: async (_payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listMediaImages(),
				resultCode: 0,
			}
		},
		[KairosActions.ListMediaSounds]: async (_payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listMediaSounds(),
				resultCode: 0,
			}
		},
		[KairosActions.ListMacros]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listMacros(payload.macroPath && refMacro(payload.macroPath), payload.deep),
				resultCode: 0,
			}
		},
		[KairosActions.ListAuxes]: async (_payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listAuxes(),
				resultCode: 0,
			}
		},
		[KairosActions.ListAuxEffects]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listAuxEffects(
					payload.pathIsName ? refAuxName(payload.path) : refAuxId(payload.path),
					payload.deep
				),
				resultCode: 0,
			}
		},
		[KairosActions.ListGfxScenes]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listGfxScenes(
					payload.scenePath ? refGfxScene(payload.scenePath) : refGfxScene([]),
					payload.deep
				),
				resultCode: 0,
			}
		},
		[KairosActions.ListGfxSceneItems]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listGfxSceneItems(refGfxScene(payload.scenePath)),
				resultCode: 0,
			}
		},
		[KairosActions.ListAudioMixerChannels]: async (_payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.listAudioMixerChannels(),
				resultCode: 0,
			}
		},
		[KairosActions.MacroPlay]: async (payload) => {
			if (!payload.macroPath || !Array.isArray(payload.macroPath)) {
				return { result: ActionExecutionResultCode.Error, message: 'Invalid payload: macroPath is not an Array' }
			}

			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.macroPlay(refMacro(payload.macroPath)),
				resultCode: 0,
			}
		},
		[KairosActions.MacroStop]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.macroStop(refMacro(payload.macroPath)),
				resultCode: 0,
			}
		},
		[KairosActions.SceneSnapshotRecall]: async (payload) => {
			return {
				result: ActionExecutionResultCode.Ok,
				resultData: await kairos.sceneSnapshotRecall(
					refSceneSnapshot(refScene(payload.scenePath), payload.snapshotPath)
				),
				resultCode: 0,
			}
		},
	} satisfies KairosActionMethods
}
