import { OscDevice } from '../integrations/osc/index.js'
import { DeviceType } from 'timeline-state-resolver-types'
import type { DeviceEntry } from 'timeline-state-resolver-api'
import { AuthenticatedHTTPSendDevice } from '../integrations/httpSend/AuthenticatedHTTPSendDevice.js'
import { ShotokuDevice } from '../integrations/shotoku/index.js'
import { HTTPWatcherDevice } from '../integrations/httpWatcher/index.js'
import { AbstractDevice } from '../integrations/abstract/index.js'
import { AtemDevice } from '../integrations/atem/index.js'
import { TcpSendDevice } from '../integrations/tcpSend/index.js'
import { QuantelDevice } from '../integrations/quantel/index.js'
import { HyperdeckDevice } from '../integrations/hyperdeck/index.js'
import { OBSDevice } from '../integrations/obs/index.js'
import { PanasonicPtzDevice } from '../integrations/panasonicPTZ/index.js'
import { LawoDevice } from '../integrations/lawo/index.js'
import { SofieChefDevice } from '../integrations/sofieChef/index.js'
import { PharosDevice } from '../integrations/pharos/index.js'
import { ViscaOverIpDevice } from '../integrations/viscaOverIP/index.js'
import { TelemetricsDevice } from '../integrations/telemetrics/index.js'
import { TriCasterDevice } from '../integrations/tricaster/index.js'
import { SingularLiveDevice } from '../integrations/singularLive/index.js'
import { MultiOSCMessageDevice } from '../integrations/multiOsc/index.js'
import { WebSocketClientDevice } from '../integrations/websocketClient/index.js'
import { vMixDeviceEntry } from '../integrations/vmix/vMixDeviceEntry.js'
import { KairosDevice } from '../integrations/kairos/index.js'
import { SisyfosDeviceEntry } from '../integrations/sisyfos/entry.js'
import { UdpSendDevice } from '../integrations/udpSend/index.js'

export type ImplementedServiceDeviceTypes =
	| DeviceType.ABSTRACT
	| DeviceType.ATEM
	| DeviceType.HTTPSEND
	| DeviceType.HTTPWATCHER
	| DeviceType.HYPERDECK
	| DeviceType.LAWO
	| DeviceType.OBS
	| DeviceType.OSC
	| DeviceType.MULTI_OSC
	| DeviceType.PANASONIC_PTZ
	| DeviceType.PHAROS
	| DeviceType.SHOTOKU
	| DeviceType.SINGULAR_LIVE
	| DeviceType.SISYFOS
	| DeviceType.SOFIE_CHEF
	| DeviceType.TCPSEND
	| DeviceType.TELEMETRICS
	| DeviceType.TRICASTER
	| DeviceType.QUANTEL
	| DeviceType.VISCA_OVER_IP
	| DeviceType.WEBSOCKET_CLIENT
	| DeviceType.VMIX
	| DeviceType.KAIROS
	| DeviceType.UDP_SEND

// TODO - move all device implementations here and remove the old Device classes
export const DevicesDict: Record<ImplementedServiceDeviceTypes, DeviceEntry> = {
	[DeviceType.ABSTRACT]: {
		deviceClass: AbstractDevice,
		canConnect: false,
		deviceName: (deviceId: string) => 'Abstract ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.ATEM]: {
		deviceClass: AtemDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'Atem ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.HTTPSEND]: {
		deviceClass: AuthenticatedHTTPSendDevice,
		canConnect: false,
		deviceName: (deviceId: string) => 'HTTPSend ' + deviceId,
		executionMode: () => 'sequential', // todo - config?
	},
	[DeviceType.HTTPWATCHER]: {
		deviceClass: HTTPWatcherDevice,
		canConnect: false,
		deviceName: (deviceId: string) => 'HTTP-Watch ' + deviceId,
		executionMode: () => 'sequential',
	},
	[DeviceType.HYPERDECK]: {
		deviceClass: HyperdeckDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'Hyperdeck ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.KAIROS]: {
		deviceClass: KairosDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'Kairos ' + deviceId,
		executionMode: () => 'sequential',
	},
	[DeviceType.LAWO]: {
		deviceClass: LawoDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'Lawo ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.OBS]: {
		deviceClass: OBSDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'OBS ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.OSC]: {
		deviceClass: OscDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'OSC ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.MULTI_OSC]: {
		deviceClass: MultiOSCMessageDevice,
		canConnect: false,
		deviceName: (deviceId: string) => 'MultiOSC ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.PANASONIC_PTZ]: {
		deviceClass: PanasonicPtzDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'Panasonic PTZ ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.PHAROS]: {
		deviceClass: PharosDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'Pharos ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.SOFIE_CHEF]: {
		deviceClass: SofieChefDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'SofieChef ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.SHOTOKU]: {
		deviceClass: ShotokuDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'SHOTOKU' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.SINGULAR_LIVE]: {
		deviceClass: SingularLiveDevice,
		canConnect: false,
		deviceName: (deviceId: string) => 'Singular.Live ' + deviceId,
		executionMode: () => 'sequential',
	},
	[DeviceType.TCPSEND]: {
		deviceClass: TcpSendDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'TCP' + deviceId,
		executionMode: () => 'sequential', // todo: should this be configurable?
	},
	[DeviceType.TELEMETRICS]: {
		deviceClass: TelemetricsDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'Telemetrics ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.TRICASTER]: {
		deviceClass: TriCasterDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'TriCaster ' + deviceId,
		executionMode: () => 'salvo',
	},
	[DeviceType.QUANTEL]: {
		deviceClass: QuantelDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'Quantel' + deviceId,
		executionMode: () => 'sequential',
	},
	[DeviceType.VISCA_OVER_IP]: {
		deviceClass: ViscaOverIpDevice,
		canConnect: false,
		deviceName: (deviceId: string) => 'VISCAOverIP ' + deviceId,
		executionMode: () => 'sequential',
	},
	[DeviceType.WEBSOCKET_CLIENT]: {
		deviceClass: WebSocketClientDevice,
		canConnect: true,
		deviceName: (deviceId: string) => 'WebSocket Client ' + deviceId,
		executionMode: () => 'sequential',
	},
	[DeviceType.SISYFOS]: new SisyfosDeviceEntry(),
	[DeviceType.VMIX]: new vMixDeviceEntry(),
	[DeviceType.UDP_SEND]: {
		deviceClass: UdpSendDevice,
		canConnect: false,
		deviceName: (deviceId: string) => 'UDP ' + deviceId,
		executionMode: () => 'sequential',
	},
}
