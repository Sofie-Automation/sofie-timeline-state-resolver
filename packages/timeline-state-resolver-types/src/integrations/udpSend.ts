import type { DeviceType } from '../generated/index.js'

export type TimelineContentUDPSendAny = TimelineContentUDPRequest
export interface TimelineContentUDPSendBase {
	deviceType: DeviceType.UDP_SEND
}
export type TimelineContentUDPRequest = TimelineContentUDPSendBase & UdpSendCommandContent

export interface UdpSendCommandContent {
	message: string
	temporalPriority?: number
	/**
	 * Commands in the same queue will be sent in order (will wait for the previous to finish before sending next
	 */
	queueId?: string
}
