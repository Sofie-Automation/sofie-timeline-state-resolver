import { ShotokuError, ShotokuErrorCode, ShotokuErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Shotoku device errors
 */
export function createShotokuError<T extends ShotokuErrorCode>(
	code: T,
	context: ShotokuErrorContextMap[T]
): ShotokuError<T> {
	return { code, context }
}
