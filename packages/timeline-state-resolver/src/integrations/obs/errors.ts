import { OBSError, OBSErrorCode, OBSErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating OBS device errors with proper context.
 */
export function createOBSError<T extends OBSErrorCode>(code: T, context: OBSErrorContextMap[T]): OBSError<T> {
	return {
		code,
		context,
	}
}
