import { DeviceType } from '../generated/index.js'
import { DeviceStatusError } from '../deviceError.js'

/**
 * Error codes for OBS device issues.
 * These codes can be customized in blueprints via deviceErrorMessages.
 */
export const OBSErrorCode = {
	DISCONNECTED: 'DEVICE_OBS_DISCONNECTED',
} as const

export type OBSErrorCode = (typeof OBSErrorCode)[keyof typeof OBSErrorCode]

/**
 * Context data for each OBS error type.
 * These fields are available for message template interpolation.
 */
export interface OBSErrorContextMap {
	[OBSErrorCode.DISCONNECTED]: {
		deviceName: string
		host: string
		port: number
		error?: string
	}
}

export type OBSError<T extends OBSErrorCode = OBSErrorCode> = DeviceStatusError<T, OBSErrorContextMap[T]>

/**
 * Default error message templates for OBS devices.
 * Can be overridden in blueprints via deviceErrorMessages.
 */
export const OBSErrorMessages: Record<OBSErrorCode, string> = {
	[OBSErrorCode.DISCONNECTED]: 'Disconnected: {{error}}',
}

export type TimelineContentOBSAny =
	| TimelineContentOBSCurrentScene
	| TimelineContentOBSCurrentTransition
	| TimelineContentOBSRecording
	| TimelineContentOBSStreaming
	| TimelineContentOBSSceneItem
	| TimelineContentOBSInputAudio
	| TimelineContentOBSInputSettings
	| TimelineContentOBSInputMedia

export enum TimelineContentTypeOBS {
	CURRENT_SCENE = 'CURRENT_SCENE',
	CURRENT_TRANSITION = 'CURRENT_TRANSITION',
	RECORDING = 'RECORDING',
	STREAMING = 'STREAMING',

	SCENE_ITEM = 'SCENE_ITEM',

	INPUT_AUDIO = 'INPUT_AUDIO',
	INPUT_SETTINGS = 'INPUT_SETTINGS',
	INPUT_MEDIA = 'INPUT_MEDIA',
}
export interface TimelineContentOBSBase {
	deviceType: DeviceType.OBS
	type: TimelineContentTypeOBS
}

export interface TimelineContentOBSCurrentScene extends TimelineContentOBSBase {
	type: TimelineContentTypeOBS.CURRENT_SCENE

	/** Name of the scene that should be current */
	sceneName: string
}

export interface TimelineContentOBSCurrentTransition extends TimelineContentOBSBase {
	type: TimelineContentTypeOBS.CURRENT_TRANSITION

	/** Name of the transition that should be current */
	transitionName: string
}

export interface TimelineContentOBSRecording extends TimelineContentOBSBase {
	type: TimelineContentTypeOBS.RECORDING

	/** Should recording be turned on */
	on: boolean
}

export interface TimelineContentOBSStreaming extends TimelineContentOBSBase {
	type: TimelineContentTypeOBS.STREAMING

	/** Should streaming be turned on */
	on: boolean
}

export interface TimelineContentOBSSceneItem extends TimelineContentOBSBase {
	deviceType: DeviceType.OBS
	type: TimelineContentTypeOBS.SCENE_ITEM

	/** Should the scene item be enabled */
	on?: boolean

	/** Should the scene item be enabled */
	transform?: OBSSceneItemTransform
}

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends Record<string, any> ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

export type TimelineContentOBSInputSettings = TimelineContentOBSBase & {
	type: TimelineContentTypeOBS.INPUT_SETTINGS
} & XOR<
		{
			sourceType: 'ffmpeg_source'
			sourceSettings: {
				close_when_inactive?: boolean
				hw_decode?: boolean
				input?: string
				is_local_file?: boolean
				local_file?: string
				looping?: boolean
			}
		},
		{
			sourceType: 'dshow_input' | 'browser_source' | 'window_capture' | 'image_source'
		}
	>

export interface TimelineContentOBSInputAudio extends TimelineContentOBSBase {
	type: TimelineContentTypeOBS.INPUT_AUDIO

	/** If the audio should be muted (`true`: audio will not be output, `false`: audio will be output) */
	mute?: boolean

	volume?: number
}
export interface TimelineContentOBSInputMedia extends TimelineContentOBSBase {
	type: TimelineContentTypeOBS.INPUT_MEDIA

	seek?: number
	state?: 'playing' | 'paused' | 'stopped'
}

export interface OBSSceneItemTransform {
	cropBottom?: number
	cropLeft?: number
	cropRight?: number
	cropTop?: number

	height?: number
	width?: number

	positionX?: number
	positionY?: number

	rotation?: number

	scaleX?: number
	scaleY?: number
}
