import { KairosDeviceState } from '../stateBuilder.js'

export const EMPTY_STATE: Omit<KairosDeviceState, 'stateTime'> = {
	aux: {},
	clipPlayers: {},
	macros: {},
	ramRecPlayers: {},
	sceneLayers: {},
	sceneSnapshots: {},
	scenes: {},
	soundPlayers: {},
	imageStores: {},
}
