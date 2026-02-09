import * as Timeline from './superfly-timeline'
import { TSRTimelineObjProps } from './mapping'
import { Content } from './superfly-timeline'

import { TimelineContentTelemetricsAny } from './integrations/telemetrics'
import { TimelineContentAtemAny } from './integrations/atem'
import { TimelineContentCasparCGAny } from './integrations/casparcg'
import { TimelineContentHTTPSendAny } from './integrations/httpSend'
import { TimelineContentTCPSendAny } from './integrations/tcpSend'
import { TimelineContentHyperdeckAny } from './integrations/hyperdeck'
import { TimelineContentLawoAny } from './integrations/lawo'
import { TimelineContentOSCAny } from './integrations/osc'
import { TimelineContentPharosAny } from './integrations/pharos'
import { TimelineContentPanasonicPtzAny } from './integrations/panasonicPTZ'
import { TimelineContentAbstractAny } from './integrations/abstract'
import { TimelineContentQuantelAny } from './integrations/quantel'
import { TimelineContentShotoku } from './integrations/shotoku'
import { TimelineContentSisyfosAny } from './integrations/sisyfos'
import { TimelineContentSofieChefAny } from './integrations/sofieChef'
import { TimelineContentVIZMSEAny } from './integrations/vizMSE'
import { TimelineContentSingularLiveAny } from './integrations/singularLive'
import { TimelineContentVMixAny } from './integrations/vmix'
import { TimelineContentOBSAny } from './integrations/obs'
import { TimelineContentTriCasterAny } from './integrations/tricaster'
import { TimelineContentWebSocketClientAny } from './integrations/websocketClient'
import { TimelineContentKairosAny } from './integrations/kairos'
import { DeviceType } from './generated'

export * from './integrations/abstract'
export * from './integrations/atem'
export * from './integrations/casparcg'
export * from './integrations/httpSend'
export * from './integrations/hyperdeck'
export * from './integrations/kairos'
export * from './integrations/lawo'
export * from './integrations/osc'
export * from './integrations/pharos'
export * from './integrations/panasonicPTZ'
export * from './integrations/sisyfos'
export * from './integrations/sofieChef'
export * from './integrations/quantel'
export * from './integrations/shotoku'
export * from './integrations/tcpSend'
export * from './integrations/vizMSE'
export * from './integrations/singularLive'
export * from './integrations/vmix'
export * from './integrations/obs'
export * from './integrations/tricaster'
export * from './integrations/telemetrics'
export * from './integrations/multiOsc'
export * from './integrations/viscaOverIP'
export * from './integrations/websocketClient'

export * from './actions'
export * from './datastore'
export * from './device'
export * from './expectedPlayoutItems'
export * from './mapping'
export * from './mediaObject'
export * from './templateString'
export * from './translations'

export * from './generated'
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
	extends Omit<Timeline.TimelineObject<TContent & TimelineDatastoreReferencesContent>, 'children'>,
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
