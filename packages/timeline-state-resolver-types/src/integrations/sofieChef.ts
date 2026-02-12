import { DeviceType, TemplateString } from '../index.js'
import { DeviceStatusDetail } from '../deviceError.js'

/**
 * Status codes for SofieChef device issues.
 * These codes can be customized in blueprints via deviceStatusMessages.
 */
export const SofieChefStatusCode = {
	NOT_CONNECTED: 'DEVICE_SOFIECHEF_NOT_CONNECTED',
	APP_STATUS: 'DEVICE_SOFIECHEF_APP_STATUS',
	WINDOW_STATUS: 'DEVICE_SOFIECHEF_WINDOW_STATUS',
} as const

export type SofieChefStatusCode = (typeof SofieChefStatusCode)[keyof typeof SofieChefStatusCode]

/**
 * Context data for each SofieChef status.
 * These fields are available for message template interpolation.
 */
export interface SofieChefStatusContextMap {
	[SofieChefStatusCode.NOT_CONNECTED]: {
		deviceName: string
	}
	[SofieChefStatusCode.APP_STATUS]: {
		deviceName: string
		message: string
	}
	[SofieChefStatusCode.WINDOW_STATUS]: {
		deviceName: string
		windowIndex: number
		message: string
	}
}

export type SofieChefStatusDetail<T extends SofieChefStatusCode = SofieChefStatusCode> = DeviceStatusDetail<
	T,
	SofieChefStatusContextMap[T]
>

/**
 * Default status message templates for SofieChef devices.
 * Can be overridden in blueprints via deviceStatusMessages.
 */
export const SofieChefStatusMessages: Record<SofieChefStatusCode, string> = {
	[SofieChefStatusCode.NOT_CONNECTED]: 'Not connected',
	[SofieChefStatusCode.APP_STATUS]: '{{message}}',
	[SofieChefStatusCode.WINDOW_STATUS]: 'Window {{windowIndex}}: {{message}}',
}

export enum TimelineContentTypeSofieChef {
	URL = 'url',
}

export type TimelineContentSofieChefAny = TimelineContentSofieChefScene

export interface TimelineContentSofieChef {
	deviceType: DeviceType.SOFIE_CHEF
	type: TimelineContentTypeSofieChef
}
export interface TimelineContentSofieChefScene extends TimelineContentSofieChef {
	type: TimelineContentTypeSofieChef.URL

	url: string | TemplateString
}
