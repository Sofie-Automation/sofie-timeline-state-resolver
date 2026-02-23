import * as Timeline from './superfly-timeline/index.js'
import { TSRTimelineObjProps } from './mapping.js'
import { Content } from './superfly-timeline/index.js'

import { TimelineContentTelemetricsAny } from './integrations/telemetrics.js'
import { TimelineContentAtemAny } from './integrations/atem.js'
import { TimelineContentCasparCGAny } from './integrations/casparcg.js'
import { TimelineContentHTTPSendAny } from './integrations/httpSend.js'
import { TimelineContentTCPSendAny } from './integrations/tcpSend.js'
import { TimelineContentHyperdeckAny } from './integrations/hyperdeck.js'
import { TimelineContentLawoAny } from './integrations/lawo.js'
import { TimelineContentOSCAny } from './integrations/osc.js'
import { TimelineContentPharosAny } from './integrations/pharos.js'
import { TimelineContentPanasonicPtzAny } from './integrations/panasonicPTZ.js'
import { TimelineContentAbstractAny } from './integrations/abstract.js'
import { TimelineContentQuantelAny } from './integrations/quantel.js'
import { TimelineContentShotoku } from './integrations/shotoku.js'
import { TimelineContentSisyfosAny } from './integrations/sisyfos.js'
import { TimelineContentSofieChefAny } from './integrations/sofieChef.js'
import { TimelineContentVIZMSEAny } from './integrations/vizMSE.js'
import { TimelineContentSingularLiveAny } from './integrations/singularLive.js'
import { TimelineContentVMixAny } from './integrations/vmix.js'
import { TimelineContentOBSAny } from './integrations/obs.js'
import { TimelineContentTriCasterAny } from './integrations/tricaster.js'
import { TimelineContentWebSocketClientAny } from './integrations/websocketClient.js'
import { TimelineContentKairosAny } from './integrations/kairos.js'
import { DeviceType } from './generated/index.js'
import { TimelineContentUDPSendAny } from './integrations/udpSend.js'

export * from './integrations/abstract.js'
export * from './integrations/atem.js'
export * from './integrations/casparcg.js'
export * from './integrations/httpSend.js'
export * from './integrations/hyperdeck.js'
export * from './integrations/kairos.js'
export * from './integrations/lawo.js'
export * from './integrations/osc.js'
export * from './integrations/pharos.js'
export * from './integrations/panasonicPTZ.js'
export * from './integrations/sisyfos.js'
export * from './integrations/sofieChef.js'
export * from './integrations/quantel.js'
export * from './integrations/shotoku.js'
export * from './integrations/tcpSend.js'
export * from './integrations/vizMSE.js'
export * from './integrations/singularLive.js'
export * from './integrations/vmix.js'
export * from './integrations/obs.js'
export * from './integrations/tricaster.js'
export * from './integrations/telemetrics.js'
export * from './integrations/multiOsc.js'
export * from './integrations/udpSend.js'
export * from './integrations/viscaOverIP.js'
export * from './integrations/websocketClient.js'

export * from './actions.js'
export * from './datastore.js'
export * from './device.js'
export * from './expectedPlayoutItems.js'
export * from './mapping.js'
export * from './mediaObject.js'
export * from './templateString.js'
export * from './translations.js'

export * from './generated/index.js'
export { Timeline }

export interface TSRTimelineKeyframe<TContent> extends Omit<Timeline.TimelineKeyframe, 'content'> {
	content: TContent
}

/**
 * An object containing references to the datastore
 */
export interface TimelineDatastoreReferences {
	/**
	 * localPath is the path to the property in the content object to override
	 */
	[localPath: string]: {
		/** Reference to the Datastore key where to fetch the value */
		datastoreKey: string
		/**
		 * If true, the referenced value in the Datastore is only applied after the timeline-object has started (ie a later-started timeline-object will not be affected)
		 */
		overwrite: boolean
	}
}
export interface TimelineDatastoreReferencesContent {
	$references?: TimelineDatastoreReferences
}

export type TSRTimeline = TSRTimelineObj<TSRTimelineContent>[]

export interface TSRTimelineObj<TContent extends { deviceType: DeviceTypeExt }>
	extends
		Omit<Timeline.TimelineObject<TContent & TimelineDatastoreReferencesContent>, 'children'>,
		TSRTimelineObjProps {
	children?: TSRTimelineObj<TSRTimelineContent>[]
}

export interface TimelineContentEmpty extends Content {
	deviceType: DeviceType.ABSTRACT
	type: 'empty'
}

// An extended DeviceType that also includes string keys for TSR plugins
export type DeviceTypeExt = DeviceType | keyof TimelineContentMap

// A map of the known Content types. TSR plugins can be injected here when needed
export interface TimelineContentMap {
	[DeviceType.ABSTRACT]: TimelineContentAbstractAny | TimelineContentEmpty
	[DeviceType.ATEM]: TimelineContentAtemAny
	[DeviceType.CASPARCG]: TimelineContentCasparCGAny
	[DeviceType.HTTPSEND]: TimelineContentHTTPSendAny
	[DeviceType.TCPSEND]: TimelineContentTCPSendAny
	[DeviceType.HYPERDECK]: TimelineContentHyperdeckAny
	[DeviceType.KAIROS]: TimelineContentKairosAny
	[DeviceType.LAWO]: TimelineContentLawoAny
	[DeviceType.OBS]: TimelineContentOBSAny
	[DeviceType.OSC]: TimelineContentOSCAny
	[DeviceType.PHAROS]: TimelineContentPharosAny
	[DeviceType.PANASONIC_PTZ]: TimelineContentPanasonicPtzAny
	[DeviceType.QUANTEL]: TimelineContentQuantelAny
	[DeviceType.SHOTOKU]: TimelineContentShotoku
	[DeviceType.SISYFOS]: TimelineContentSisyfosAny
	[DeviceType.SOFIE_CHEF]: TimelineContentSofieChefAny
	[DeviceType.SINGULAR_LIVE]: TimelineContentSingularLiveAny
	[DeviceType.VMIX]: TimelineContentVMixAny
	[DeviceType.VIZMSE]: TimelineContentVIZMSEAny
	[DeviceType.TELEMETRICS]: TimelineContentTelemetricsAny
	[DeviceType.TRICASTER]: TimelineContentTriCasterAny
	[DeviceType.WEBSOCKET_CLIENT]: TimelineContentWebSocketClientAny
	[DeviceType.UDP_SEND]: TimelineContentUDPSendAny
}

export type TSRTimelineContent = TimelineContentMap[keyof TimelineContentMap]

/**
 * A simple key value store that can be referred to from the timeline objects
 */
export interface Datastore {
	[datastoreKey: string]: {
		/** The value that will replace a value in the Timeline-object content */
		value: any
		/** A unix-Timestamp of when the value was set. (Note that this must not be set a value in the future.) */
		modified: number
	}
}
