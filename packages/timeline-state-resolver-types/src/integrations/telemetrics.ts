import { DeviceType } from '../index.js'
import { DeviceStatusDetail } from '../deviceStatusDetail.js'

/**
 * Status codes for Telemetrics device issues.
 * These codes can be customized in blueprints via deviceStatusMessages.
 */
export const TelemetricsStatusCode = {
	NOT_CONNECTED: 'DEVICE_TELEMETRICS_NOT_CONNECTED',
	NOT_INITIALIZED: 'DEVICE_TELEMETRICS_NOT_INITIALIZED',
	GENERAL_ERROR: 'DEVICE_TELEMETRICS_GENERAL_ERROR',
} as const

export type TelemetricsStatusCode = (typeof TelemetricsStatusCode)[keyof typeof TelemetricsStatusCode]

/**
 * Context data for each Telemetrics status.
 * These fields are available for message template interpolation.
 */
export interface TelemetricsStatusContextMap {
	[TelemetricsStatusCode.NOT_CONNECTED]: {
		deviceName: string
	}
	[TelemetricsStatusCode.NOT_INITIALIZED]: {
		deviceName: string
	}
	[TelemetricsStatusCode.GENERAL_ERROR]: {
		deviceName: string
		message: string
	}
}

export type TelemetricsStatusDetail<T extends TelemetricsStatusCode = TelemetricsStatusCode> = DeviceStatusDetail<
	T,
	TelemetricsStatusContextMap[T]
>

/**
 * Default status message templates for Telemetrics devices.
 * Can be overridden in blueprints via deviceStatusMessages.
 */
export const TelemetricsStatusMessages: Record<TelemetricsStatusCode, string> = {
	[TelemetricsStatusCode.NOT_CONNECTED]: 'No connection',
	[TelemetricsStatusCode.NOT_INITIALIZED]: 'Not initialized',
	[TelemetricsStatusCode.GENERAL_ERROR]: '{{message}}',
}

export type TimelineContentTelemetricsAny = TimelineContentTelemetrics

export interface TimelineContentTelemetrics {
	deviceType: DeviceType.TELEMETRICS
	presetShotIdentifiers: number[]
}
