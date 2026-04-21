import * as Timeline from './superfly-timeline/index.js'
import { TSRTimelineObjProps } from './mapping.js'
import { Content } from './superfly-timeline/index.js'

import { TimelineContentTelemetricsAny } from './integrations/telemetrics/timeline.js'
import { TimelineContentAtemAny } from './integrations/atem/timeline.js'
import { TimelineContentCasparCGAny } from './integrations/casparcg/timeline.js'
import { TimelineContentHTTPSendAny } from './integrations/httpSend/timeline.js'
import { TimelineContentTCPSendAny } from './integrations/tcpSend/timeline.js'
import { TimelineContentHyperdeckAny } from './integrations/hyperdeck/timeline.js'
import { TimelineContentLawoAny } from './integrations/lawo/timeline.js'
import { TimelineContentOSCAny } from './integrations/osc/timeline.js'
import { TimelineContentPharosAny } from './integrations/pharos/timeline.js'
import { TimelineContentPanasonicPtzAny } from './integrations/panasonicPTZ/timeline.js'
import { TimelineContentAbstractAny } from './integrations/abstract/timeline.js'
import { TimelineContentQuantelAny } from './integrations/quantel/timeline.js'
import { TimelineContentShotoku } from './integrations/shotoku/timeline.js'
import { TimelineContentSisyfosAny } from './integrations/sisyfos/timeline.js'
import { TimelineContentSofieChefAny } from './integrations/sofieChef/timeline.js'
import { TimelineContentVIZMSEAny } from './integrations/vizMSE/timeline.js'
import { TimelineContentSingularLiveAny } from './integrations/singularLive/timeline.js'
import { TimelineContentVMixAny } from './integrations/vmix/timeline.js'
import { TimelineContentOBSAny } from './integrations/obs/timeline.js'
import { TimelineContentTriCasterAny } from './integrations/tricaster/timeline.js'
import { TimelineContentWebSocketClientAny } from './integrations/websocketClient/timeline.js'
import { TimelineContentKairosAny } from './integrations/kairos/timeline.js'
import { DeviceType, TSRDeviceTypesMap } from './generated/index.js'
import { TimelineContentUDPSendAny } from './integrations/udpSend/timeline.js'
import { TimelineContentOgrafAny } from './integrations/ograf/timeline.js'

export * from './integrations/abstract/timeline.js'
export * from './integrations/atem/timeline.js'
export * from './integrations/casparcg/timeline.js'
export * from './integrations/httpSend/timeline.js'
export * from './integrations/hyperdeck/timeline.js'
export * from './integrations/kairos/timeline.js'
export * from './integrations/lawo/timeline.js'
export * from './integrations/ograf/timeline.js'
export * from './integrations/osc/timeline.js'
export * from './integrations/pharos/timeline.js'
export * from './integrations/panasonicPTZ/timeline.js'
export * from './integrations/sisyfos/timeline.js'
export * from './integrations/sofieChef/timeline.js'
export * from './integrations/quantel/timeline.js'
export * from './integrations/shotoku/timeline.js'
export * from './integrations/tcpSend/timeline.js'
export * from './integrations/vizMSE/timeline.js'
export * from './integrations/singularLive/timeline.js'
export * from './integrations/vmix/timeline.js'
export * from './integrations/obs/timeline.js'
export * from './integrations/tricaster/timeline.js'
export * from './integrations/telemetrics/timeline.js'
export * from './integrations/multiOsc/timeline.js'
export * from './integrations/udpSend/timeline.js'
export * from './integrations/viscaOverIP/timeline.js'
export * from './integrations/websocketClient/timeline.js'

export * from './actions.js'
export * from './datastore.js'
export * from './device.js'
export * from './events.js'
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
	[DeviceType.OGRAF]: TimelineContentOgrafAny
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

export type TSRMappingOptions = TSRDeviceTypesMap[keyof TSRDeviceTypesMap]['Mappings']

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

export interface DeviceTimelineState<TContent extends TSRTimelineContent = TSRTimelineContent> {
	/** The timestamp for this state */
	time: Timeline.Time
	/** All objects that are active on each respective layer */
	objects: DeviceTimelineStateObject<TContent>[]
}

/**
 * A simplified representation of the TimelineObjet that was matched for this device
 */
export interface DeviceTimelineStateObject<
	TContent extends TSRTimelineContent = TSRTimelineContent,
> extends TSRTimelineObjProps {
	/** ID of the object. Must be unique! */
	id: string
	/**
	 * Priority. Affects which object "wins" when there are two colliding objects on the same layer.
	 */
	priority: number
	/**
	 * The layer where the object is played.
	 * */
	layer: string | number
	/** The payload of the timeline-object. Can be anything you want. */
	content: TContent

	instance: Timeline.TimelineObjectInstance

	/** All datastore values applied and the timestamp of when they were applied */
	datastoreRefs?: Record<string, number>
	/** Timestamp of the last datastore value applied to this object */
	lastModified?: number
}
