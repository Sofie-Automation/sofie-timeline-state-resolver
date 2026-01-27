import { TriCasterError, TriCasterErrorCode, TriCasterErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating TriCaster device errors
 */
export function createTriCasterError<T extends TriCasterErrorCode>(
	code: T,
	context: TriCasterErrorContextMap[T]
): TriCasterError<T> {
	return { code, context }
}
