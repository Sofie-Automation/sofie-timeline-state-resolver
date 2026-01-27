import { DeviceType } from '../generated/index.js'

export enum TimelineContentTypePharos {
	SCENE = 'scene',
	TIMELINE = 'timeline',
}

export type TimelineContentPharosAny = TimelineContentPharosScene | TimelineContentPharosTimeline

export interface TimelineContentPharos {
	deviceType: DeviceType.PHAROS
	type: TimelineContentTypePharos

	/** override: don't stop / release */
	noRelease?: true
	stopped?: boolean
}
export interface TimelineContentPharosScene extends TimelineContentPharos {
	type: TimelineContentTypePharos.SCENE
	stopped?: boolean
	noRelease?: true

	scene: number
	fade?: number
}
export interface TimelineContentPharosTimeline extends TimelineContentPharos {
	type: TimelineContentTypePharos.TIMELINE
	stopped?: boolean
	noRelease?: true

	timeline: number
	pause?: boolean
	rate?: number
	fade?: number
}

export const PharosErrorCode = {
	NOT_CONNECTED: 'DEVICE_PHAROS_NOT_CONNECTED',
} as const
export type PharosErrorCode = (typeof PharosErrorCode)[keyof typeof PharosErrorCode]

export interface PharosErrorContextMap {
	[PharosErrorCode.NOT_CONNECTED]: Record<string, never>
}

export type PharosError<T extends PharosErrorCode = PharosErrorCode> = {
	code: T
	context: PharosErrorContextMap[T]
}

export const PharosErrorMessages: Record<PharosErrorCode, string> = {
	[PharosErrorCode.NOT_CONNECTED]: 'Not connected',
}
