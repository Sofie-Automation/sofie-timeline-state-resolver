import { VindralComposerDeviceState } from '../stateBuilder.js'

export const EMPTY_STATE: Omit<VindralComposerDeviceState, 'stateTime'> = {
	connectors: {},
	sceneLayers: {},
	scriptEngines: {},
	switchers: {},
	switcherOverlays: {},
	mediaPlayers: {},
	htmlRenderers: {},
	audioSources: {},
}
