import { ShotokuStatusDetail, ShotokuStatusCode, ShotokuStatusContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Shotoku device status details
 */
export function createShotokuStatusDetail<T extends ShotokuStatusCode>(
	code: T,
	context: ShotokuStatusContextMap[T]
): ShotokuStatusDetail<T> {
	return { code, context }
}
