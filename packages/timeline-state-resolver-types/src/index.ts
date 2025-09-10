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

export interface TSRTimelineObj<TContent extends { deviceType: DeviceType }>
	extends Omit<Timeline.TimelineObject<TContent & TimelineDatastoreReferencesContent>, 'children'>,
		TSRTimelineObjProps {
	children?: TSRTimelineObj<TSRTimelineContent>[]
}

export interface TimelineContentEmpty extends Content {
	deviceType: DeviceType.ABSTRACT
	type: 'empty'
}

export type TSRTimelineContent =
	| TimelineContentEmpty
	| TimelineContentAbstractAny
	| TimelineContentAtemAny
	| TimelineContentCasparCGAny
	| TimelineContentHTTPSendAny
	| TimelineContentTCPSendAny
	| TimelineContentHyperdeckAny
	| TimelineContentLawoAny
	| TimelineContentOBSAny
	| TimelineContentOSCAny
	| TimelineContentPharosAny
	| TimelineContentPanasonicPtzAny
	| TimelineContentQuantelAny
	| TimelineContentShotoku
	| TimelineContentSisyfosAny
	| TimelineContentSofieChefAny
	| TimelineContentSingularLiveAny
	| TimelineContentVMixAny
	| TimelineContentVIZMSEAny
	| TimelineContentTelemetricsAny
	| TimelineContentTriCasterAny
	| TimelineContentWebSocketClientAny
	| TimelineContentKairosAny

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
