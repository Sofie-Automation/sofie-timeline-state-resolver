import { LawoError, LawoErrorCode, LawoErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Lawo device errors
 */
export function createLawoError<T extends LawoErrorCode>(code: T, context: LawoErrorContextMap[T]): LawoError<T> {
	return { code, context }
}
