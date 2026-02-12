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

export const PharosStatusCode = {
	NOT_CONNECTED: 'DEVICE_PHAROS_NOT_CONNECTED',
} as const
export type PharosStatusCode = (typeof PharosStatusCode)[keyof typeof PharosStatusCode]

export interface PharosStatusContextMap {
	[PharosStatusCode.NOT_CONNECTED]: Record<string, never>
}

export type PharosStatusDetail<T extends PharosStatusCode = PharosStatusCode> = {
	code: T
	context: PharosStatusContextMap[T]
}

export const PharosStatusMessages: Record<PharosStatusCode, string> = {
	[PharosStatusCode.NOT_CONNECTED]: 'Not connected',
}
