import { DeviceType } from '../generated/index.js'

export type TimelineContentQuantelAny = TimelineContentQuantelClip
export interface TimelineContentQuantelClip {
	deviceType: DeviceType.QUANTEL
	notOnAir?: boolean

	/** The title of the clip to be played (example: 'AMB'), either this or guid must be provided */
	title?: string

	/** The GUID of the clip to be played, either this or title must be provided */
	guid?: string

	/** The point in the clip where to start playing. When looping, will return to this point. [milliseconds from start of file] */
	inPoint?: number
	/** The duration of the file. The playout will either freeze after this time. */
	length?: number

	/** When pausing, the unix-time the playout was paused. */
	pauseTime?: number
	/** If the video is playing or is paused (defaults to true) */
	playing?: boolean

	/** If true, the startTime won't be used to SEEK to the correct place in the media */
	noStarttime?: boolean

	// inTransition?: QuantelTransition
	outTransition?: QuantelOutTransition
}
export type QuantelOutTransition = QuantelTransitionDelay
export interface QuantelTransitionBase {
	type: QuantelTransitionType
}
export enum QuantelTransitionType {
	DELAY = 0,
}
export interface QuantelTransitionDelay {
	type: QuantelTransitionType.DELAY

	// For how long to delay the stop (ms)
	delay: number
}

export const QuantelStatusCode = {
	NOT_CONNECTED: 'DEVICE_QUANTEL_NOT_CONNECTED',
	NOT_INITIALIZED: 'DEVICE_QUANTEL_NOT_INITIALIZED',
	STATUS_MESSAGE: 'DEVICE_QUANTEL_STATUS_MESSAGE',
} as const
export type QuantelStatusCode = (typeof QuantelStatusCode)[keyof typeof QuantelStatusCode]

export interface QuantelStatusContextMap {
	[QuantelStatusCode.NOT_CONNECTED]: Record<string, never>
	[QuantelStatusCode.NOT_INITIALIZED]: Record<string, never>
	[QuantelStatusCode.STATUS_MESSAGE]: { statusMessage: string }
}

export type QuantelStatusDetail<T extends QuantelStatusCode = QuantelStatusCode> = {
	code: T
	context: QuantelStatusContextMap[T]
}

export const QuantelStatusMessages: Record<QuantelStatusCode, string> = {
	[QuantelStatusCode.NOT_CONNECTED]: 'Not connected',
	[QuantelStatusCode.NOT_INITIALIZED]: 'Quantel device connection not initialized (restart required)',
	[QuantelStatusCode.STATUS_MESSAGE]: '{{statusMessage}}',
}
