import { DeviceType } from '../generated/index.js'
import { DeviceStatusDetail } from '../deviceError.js'

/**
 * Status codes for Panasonic PTZ device issues.
 * These codes can be customized in blueprints via deviceStatusMessages.
 */
export const PanasonicPTZStatusCode = {
	NOT_CONNECTED: 'DEVICE_PANASONIC_PTZ_NOT_CONNECTED',
} as const

export type PanasonicPTZStatusCode = (typeof PanasonicPTZStatusCode)[keyof typeof PanasonicPTZStatusCode]

/**
 * Context data for each Panasonic PTZ status.
 * These fields are available for message template interpolation.
 */
export interface PanasonicPTZStatusContextMap {
	[PanasonicPTZStatusCode.NOT_CONNECTED]: {
		deviceName: string
		host?: string
		port?: number
	}
}

export type PanasonicPTZStatusDetail<T extends PanasonicPTZStatusCode = PanasonicPTZStatusCode> = DeviceStatusDetail<
	T,
	PanasonicPTZStatusContextMap[T]
>

/**
 * Default status message templates for Panasonic PTZ devices.
 * Can be overridden in blueprints via deviceStatusMessages.
 */
export const PanasonicPTZStatusMessages: Record<PanasonicPTZStatusCode, string> = {
	[PanasonicPTZStatusCode.NOT_CONNECTED]: 'Not connected',
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
