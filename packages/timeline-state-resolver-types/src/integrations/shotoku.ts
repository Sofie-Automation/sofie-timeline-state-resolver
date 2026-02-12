import { DeviceType } from '../generated/index.js'

export enum TimelineContentTypeShotoku {
	SHOT = 'shot',
	SEQUENCE = 'sequence',
}

export enum ShotokuTransitionType {
	Cut = 'cut',
	Fade = 'fade',
}
export interface ShotokuCommandContent {
	shot: number
	show?: number /** Defaults to 1 */
	transitionType?: ShotokuTransitionType
	changeOperatorScreen?: boolean
}

export interface TimelineContentShotokuShot extends ShotokuCommandContent {
	deviceType: DeviceType.SHOTOKU
	type: TimelineContentTypeShotoku.SHOT
}
export interface TimelineContentShotokuSequence {
	deviceType: DeviceType.SHOTOKU
	type: TimelineContentTypeShotoku.SEQUENCE

	sequenceId: string
	shots: Array<
		{
			offset: number
		} & ShotokuCommandContent
	>
}

export type TimelineContentShotoku = TimelineContentShotokuShot | TimelineContentShotokuSequence

export const ShotokuStatusCode = {
	NOT_CONNECTED: 'DEVICE_SHOTOKU_NOT_CONNECTED',
} as const
export type ShotokuStatusCode = (typeof ShotokuStatusCode)[keyof typeof ShotokuStatusCode]

export interface ShotokuStatusContextMap {
	[ShotokuStatusCode.NOT_CONNECTED]: Record<string, never>
}

export type ShotokuStatusDetail<T extends ShotokuStatusCode = ShotokuStatusCode> = {
	code: T
	context: ShotokuStatusContextMap[T]
}

export const ShotokuStatusMessages: Record<ShotokuStatusCode, string> = {
	[ShotokuStatusCode.NOT_CONNECTED]: 'Not connected',
}
