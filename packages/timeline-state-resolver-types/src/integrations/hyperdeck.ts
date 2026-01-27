import { DeviceType } from '../generated/index.js'
import { DeviceStatusError } from '../deviceError.js'

/**
 * Error codes for Hyperdeck device issues.
 * These codes can be customized in blueprints via deviceErrorMessages.
 */
export const HyperdeckErrorCode = {
	NOT_CONNECTED: 'DEVICE_HYPERDECK_NOT_CONNECTED',
	LOW_RECORDING_TIME: 'DEVICE_HYPERDECK_LOW_RECORDING_TIME',
	SLOT_NOT_MOUNTED: 'DEVICE_HYPERDECK_SLOT_NOT_MOUNTED',
	NOT_RECORDING: 'DEVICE_HYPERDECK_NOT_RECORDING',
	NOT_PLAYING: 'DEVICE_HYPERDECK_NOT_PLAYING',
} as const

export type HyperdeckErrorCode = (typeof HyperdeckErrorCode)[keyof typeof HyperdeckErrorCode]

/**
 * Context data for each Hyperdeck error type.
 * These fields are available for message template interpolation.
 */
export interface HyperdeckErrorContextMap {
	[HyperdeckErrorCode.NOT_CONNECTED]: {
		deviceName: string
		host: string
		port: number
	}
	[HyperdeckErrorCode.LOW_RECORDING_TIME]: {
		deviceName: string
		minutes: number
		seconds: number
	}
	[HyperdeckErrorCode.SLOT_NOT_MOUNTED]: {
		deviceName: string
		slot: number
	}
	[HyperdeckErrorCode.NOT_RECORDING]: {
		deviceName: string
	}
	[HyperdeckErrorCode.NOT_PLAYING]: {
		deviceName: string
	}
}

export type HyperdeckError<T extends HyperdeckErrorCode = HyperdeckErrorCode> = DeviceStatusError<
	T,
	HyperdeckErrorContextMap[T]
>

/**
 * Default error message templates for Hyperdeck devices.
 * Can be overridden in blueprints via deviceErrorMessages.
 */
export const HyperdeckErrorMessages: Record<HyperdeckErrorCode, string> = {
	[HyperdeckErrorCode.NOT_CONNECTED]: 'Not connected',
	[HyperdeckErrorCode.LOW_RECORDING_TIME]:
		'Recording time left is less than {{minutes}} minutes and {{seconds}} seconds',
	[HyperdeckErrorCode.SLOT_NOT_MOUNTED]: 'Slot {{slot}} is not mounted',
	[HyperdeckErrorCode.NOT_RECORDING]: 'Hyperdeck not recording',
	[HyperdeckErrorCode.NOT_PLAYING]: 'Hyperdeck not playing',
}

export enum TimelineContentTypeHyperdeck {
	TRANSPORT = 'transport',
}

// Note: These are copied from hyperdeck-connection -----------
export enum TransportStatus {
	PREVIEW = 'preview',
	STOPPED = 'stopped',
	PLAY = 'play',
	FORWARD = 'forward',
	REWIND = 'rewind',
	JOG = 'jog',
	SHUTTLE = 'shuttle',
	RECORD = 'record',
}
export enum SlotId {
	ONE = 1,
	TWO = 2,
}
export enum SlotStatus {
	EMPTY = 'empty',
	MOUNTING = 'mounting',
	ERROR = 'error',
	MOUNTED = 'mounted',
}
export enum VideoFormat {
	NTSC = 'NTSC',
	PAL = 'PAL',
	NTSCp = 'NTSCp',
	PALp = 'PALp',
	_720p50 = '720p50',
	_720p5994 = '720p5994',
	_720p60 = '720p60',
	_1080p23976 = '1080p23976',
	_1080p24 = '1080p24',
	_1080p25 = '1080p25',
	_1080p2997 = '1080p2997',
	_1080p30 = '1080p30',
	_1080i50 = '1080i50',
	_1080i5994 = '1080i5994',
	_1080i60 = '1080i60',
	_4Kp23976 = '4Kp23976',
	_4Kp24 = '4Kp24',
	_4Kp25 = '4Kp25',
	_4Kp2997 = '4Kp2997',
	_4Kp30 = '4Kp30',
	_4Kp50 = '4Kp50',
	_4Kp5994 = '4Kp5994',
	_4Kp60 = '4Kp60',
}
// -------------------------------------------------------------

export type TimelineContentHyperdeckAny = TimelineContentHyperdeckTransport

export interface TimelineContentHyperdeck {
	deviceType: DeviceType.HYPERDECK
	/** The type of control of the Hyperdeck */
	type: TimelineContentTypeHyperdeck
}
export type TimelineContentHyperdeckTransport = TimelineContentHyperdeck & {
	type: TimelineContentTypeHyperdeck.TRANSPORT
} & (
		| {
				status: TransportStatus.PREVIEW
		  }
		| {
				status: TransportStatus.STOPPED
		  }
		| {
				status: TransportStatus.PLAY
				/** How fast to play the currently-playing clip [-5000 - 5000]. 1x speed is 100. 0 is stopped. Negative values are rewind. Values above 100 are fast-forward. */
				speed?: number
				/** Whether or not to loop the currently-playing clip */
				loop?: boolean
				/** Whether or not to stop playback when the currently-playing clip is finished */
				singleClip?: boolean
				/** The numeric ID of the clip to play. If already playing, null means continue playing the current clip. If not playing, null means play last played clip. */
				clipId: number | null
		  }
		| {
				status: TransportStatus.FORWARD
		  }
		| {
				status: TransportStatus.REWIND
		  }
		| {
				status: TransportStatus.JOG
		  }
		| {
				status: TransportStatus.SHUTTLE
		  }
		| {
				status: TransportStatus.RECORD

				/** The filename to record to */
				recordFilename?: string
		  }
	)
