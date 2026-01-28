import { DeviceType } from '../generated/index.js'
import { DeviceStatusError } from '../deviceError.js'

/**
 * Error codes for Panasonic PTZ device issues.
 * These codes can be customized in blueprints via deviceErrorMessages.
 */
export const PanasonicPTZErrorCode = {
	NOT_CONNECTED: 'DEVICE_PANASONIC_PTZ_NOT_CONNECTED',
} as const

export type PanasonicPTZErrorCode = (typeof PanasonicPTZErrorCode)[keyof typeof PanasonicPTZErrorCode]

/**
 * Context data for each Panasonic PTZ error type.
 * These fields are available for message template interpolation.
 */
export interface PanasonicPTZErrorContextMap {
	[PanasonicPTZErrorCode.NOT_CONNECTED]: {
		deviceName: string
		host?: string
		port?: number
	}
}

export type PanasonicPTZError<T extends PanasonicPTZErrorCode = PanasonicPTZErrorCode> = DeviceStatusError<
	T,
	PanasonicPTZErrorContextMap[T]
>

/**
 * Default error message templates for Panasonic PTZ devices.
 * Can be overridden in blueprints via deviceErrorMessages.
 */
export const PanasonicPTZErrorMessages: Record<PanasonicPTZErrorCode, string> = {
	[PanasonicPTZErrorCode.NOT_CONNECTED]: 'Not connected',
}

export enum TimelineContentTypePanasonicPtz {
	PRESET = 'presetMem',
	SPEED = 'presetSpeed',
	ZOOM_SPEED = 'zoomSpeed',
	ZOOM = 'zoom',
}

export type TimelineContentPanasonicPtzAny =
	| TimelineContentPanasonicPtzZoomSpeed
	| TimelineContentPanasonicPtzZoom
	| TimelineContentPanasonicPtzPresetSpeed
	| TimelineContentPanasonicPtzPreset
export interface TimelineContentPanasonicPtz {
	deviceType: DeviceType.PANASONIC_PTZ
	type: TimelineContentTypePanasonicPtz
}
export interface TimelineContentPanasonicPtzZoomSpeed extends TimelineContentPanasonicPtz {
	type: TimelineContentTypePanasonicPtz.ZOOM_SPEED
	zoomSpeed: number
}

export interface TimelineContentPanasonicPtzZoom extends TimelineContentPanasonicPtz {
	type: TimelineContentTypePanasonicPtz.ZOOM
	zoom: number
}

export interface TimelineContentPanasonicPtzPresetSpeed extends TimelineContentPanasonicPtz {
	type: TimelineContentTypePanasonicPtz.SPEED
	speed: number
}

export interface TimelineContentPanasonicPtzPreset extends TimelineContentPanasonicPtz {
	type: TimelineContentTypePanasonicPtz.PRESET
	preset: number
}
