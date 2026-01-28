import { DeviceType } from '../generated/index.js'

export type TimelineContentTCPSendAny = TimelineContentTCPRequest
export interface TimelineContentTCPSendBase {
	deviceType: DeviceType.TCPSEND
}
export type TimelineContentTCPRequest = TimelineContentTCPSendBase & TcpSendCommandContent

export interface TcpSendCommandContent {
	message: string
	temporalPriority?: number
	/**
	 * Commands in the same queue will be sent in order (will wait for the previous to finish before sending next
	 */
	queueId?: string
}
