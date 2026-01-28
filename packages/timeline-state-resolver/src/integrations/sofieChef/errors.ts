import { SofieChefError, SofieChefErrorCode, SofieChefErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating SofieChef device errors with proper context.
 */
export function createSofieChefError<T extends SofieChefErrorCode>(
	code: T,
	context: SofieChefErrorContextMap[T]
): SofieChefError<T> {
	return {
		code,
		context,
	}
}
