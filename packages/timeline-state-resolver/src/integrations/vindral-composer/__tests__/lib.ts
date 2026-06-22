import {
	DeviceType,
	Mappings,
	MappingVindralComposerType,
	SomeMappingVindralComposer,
} from 'timeline-state-resolver-types'
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

export const MAPPINGS: Mappings<SomeMappingVindralComposer> = {
	connLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: { mappingType: MappingVindralComposerType.Connector },
	},
	slLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: { mappingType: MappingVindralComposerType.SceneLayer, scene: 'main', layer: 'bg' },
	},
	seLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: { mappingType: MappingVindralComposerType.ScriptEngine, functionName: 'myFunc' },
	},
	swLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: { mappingType: MappingVindralComposerType.Switcher, switcherId: 'abc-123' },
	},
	mpLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: {
			mappingType: MappingVindralComposerType.MediaPlayer,
			mediaPlayerId: 'player-guid',
			mediaPlayerName: 'ClipPlayer1',
			autoPlayOnMediaChange: true,
		},
	},
	htmlLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: {
			mappingType: MappingVindralComposerType.Html,
			webPageRendererId: 'html-guid',
			webPageRendererName: 'WebRenderer1',
		},
	},
	asLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: {
			mappingType: MappingVindralComposerType.AudioSource,
			audioSourceId: 'as-guid',
			audioSourceName: 'AudioSource1',
		},
	},
	ovLayer: {
		device: DeviceType.VINDRAL_COMPOSER,
		deviceId: 'vc0',
		options: {
			mappingType: MappingVindralComposerType.SwitcherOverlay,
			switcherId: 'sw-123',
			overlay: 2,
		},
	},
}
