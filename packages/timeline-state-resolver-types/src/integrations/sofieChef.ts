import { DeviceType, TemplateString } from '../index.js'
import { DeviceStatusError } from '../deviceError.js'

/**
 * Error codes for SofieChef device issues.
 * These codes can be customized in blueprints via deviceErrorMessages.
 */
export const SofieChefErrorCode = {
	NOT_CONNECTED: 'DEVICE_SOFIECHEF_NOT_CONNECTED',
	APP_STATUS: 'DEVICE_SOFIECHEF_APP_STATUS',
	WINDOW_STATUS: 'DEVICE_SOFIECHEF_WINDOW_STATUS',
} as const

export type SofieChefErrorCode = (typeof SofieChefErrorCode)[keyof typeof SofieChefErrorCode]

/**
 * Context data for each SofieChef error type.
 * These fields are available for message template interpolation.
 */
export interface SofieChefErrorContextMap {
	[SofieChefErrorCode.NOT_CONNECTED]: {
		deviceName: string
	}
	[SofieChefErrorCode.APP_STATUS]: {
		deviceName: string
		message: string
	}
	[SofieChefErrorCode.WINDOW_STATUS]: {
		deviceName: string
		windowIndex: number
		message: string
	}
}

export type SofieChefError<T extends SofieChefErrorCode = SofieChefErrorCode> = DeviceStatusError<
	T,
	SofieChefErrorContextMap[T]
>

/**
 * Default error message templates for SofieChef devices.
 * Can be overridden in blueprints via deviceErrorMessages.
 */
export const SofieChefErrorMessages: Record<SofieChefErrorCode, string> = {
	[SofieChefErrorCode.NOT_CONNECTED]: 'Not connected',
	[SofieChefErrorCode.APP_STATUS]: '{{message}}',
	[SofieChefErrorCode.WINDOW_STATUS]: 'Window {{windowIndex}}: {{message}}',
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
