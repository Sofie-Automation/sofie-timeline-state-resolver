import { DeviceType } from '../generated/index.js'

export enum TimelineContentTypeViscaOverIp {
	RECALL_PRESET = 'recallPreset',
	PAN_TILT_SPEED = 'panTiltSpeed',
	ZOOM_SPEED = 'zoomSpeed',
	FOCUS_SPEED = 'focusSpeed',
}

export type TimelineContentViscaOverIpAny =
	| TimelineContentViscaOverIpRecallPreset
	| TimelineContentViscaOverIpPanTiltSpeed
	| TimelineContentViscaOverIpZoomSpeed
	| TimelineContentViscaOverIpFocusSpeed

export interface TimelineContentViscaOverIpBase {
	deviceType: DeviceType.VISCA_OVER_IP
	type: TimelineContentTypeViscaOverIp
}

export interface TimelineContentViscaOverIpRecallPreset extends TimelineContentViscaOverIpBase {
	type: TimelineContentTypeViscaOverIp.RECALL_PRESET
	/** Preset number to recall (0-based) */
	preset: number
}

export interface TimelineContentViscaOverIpPanTiltSpeed extends TimelineContentViscaOverIpBase {
	type: TimelineContentTypeViscaOverIp.PAN_TILT_SPEED
	/** Pan speed: negative = left, positive = right. Range typically -1 to +1 */
	panSpeed: number
	/** Tilt speed: negative = down, positive = up. Range typically -1 to +1 */
	tiltSpeed: number
}

export interface TimelineContentViscaOverIpZoomSpeed extends TimelineContentViscaOverIpBase {
	type: TimelineContentTypeViscaOverIp.ZOOM_SPEED
	/** Zoom speed: negative = wide, positive = tele. Range typically -1 to +1 */
	zoomSpeed: number
}

export interface TimelineContentViscaOverIpFocusSpeed extends TimelineContentViscaOverIpBase {
	type: TimelineContentTypeViscaOverIp.FOCUS_SPEED
	/** Focus speed: negative = near, positive = far. Range typically -1 to +1 */
	focusSpeed: number
}
