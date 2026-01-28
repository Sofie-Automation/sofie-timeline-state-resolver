import { DeviceType } from '../index.js'
import { DeviceStatusError } from '../deviceError.js'

/**
 * Error codes for Telemetrics device issues.
 * These codes can be customized in blueprints via deviceErrorMessages.
 */
export const TelemetricsErrorCode = {
	NOT_CONNECTED: 'DEVICE_TELEMETRICS_NOT_CONNECTED',
	NOT_INITIALIZED: 'DEVICE_TELEMETRICS_NOT_INITIALIZED',
	GENERAL_ERROR: 'DEVICE_TELEMETRICS_GENERAL_ERROR',
} as const

export type TelemetricsErrorCode = (typeof TelemetricsErrorCode)[keyof typeof TelemetricsErrorCode]

/**
 * Context data for each Telemetrics error type.
 * These fields are available for message template interpolation.
 */
export interface TelemetricsErrorContextMap {
	[TelemetricsErrorCode.NOT_CONNECTED]: {
		deviceName: string
	}
	[TelemetricsErrorCode.NOT_INITIALIZED]: {
		deviceName: string
	}
	[TelemetricsErrorCode.GENERAL_ERROR]: {
		deviceName: string
		message: string
	}
}

export type TelemetricsError<T extends TelemetricsErrorCode = TelemetricsErrorCode> = DeviceStatusError<
	T,
	TelemetricsErrorContextMap[T]
>

/**
 * Default error message templates for Telemetrics devices.
 * Can be overridden in blueprints via deviceErrorMessages.
 */
export const TelemetricsErrorMessages: Record<TelemetricsErrorCode, string> = {
	[TelemetricsErrorCode.NOT_CONNECTED]: 'No connection',
	[TelemetricsErrorCode.NOT_INITIALIZED]: 'Not initialized',
	[TelemetricsErrorCode.GENERAL_ERROR]: '{{message}}',
}

export type TimelineContentTelemetricsAny = TimelineContentTelemetrics

export interface TimelineContentTelemetrics {
	deviceType: DeviceType.TELEMETRICS
	presetShotIdentifiers: number[]
}
