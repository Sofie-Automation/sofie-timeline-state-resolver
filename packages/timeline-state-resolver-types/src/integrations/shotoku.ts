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

export const ShotokuErrorCode = {
	NOT_CONNECTED: 'DEVICE_SHOTOKU_NOT_CONNECTED',
} as const
export type ShotokuErrorCode = (typeof ShotokuErrorCode)[keyof typeof ShotokuErrorCode]

export interface ShotokuErrorContextMap {
	[ShotokuErrorCode.NOT_CONNECTED]: Record<string, never>
}

export type ShotokuError<T extends ShotokuErrorCode = ShotokuErrorCode> = {
	code: T
	context: ShotokuErrorContextMap[T]
}

export const ShotokuErrorMessages: Record<ShotokuErrorCode, string> = {
	[ShotokuErrorCode.NOT_CONNECTED]: 'Not connected',
}
