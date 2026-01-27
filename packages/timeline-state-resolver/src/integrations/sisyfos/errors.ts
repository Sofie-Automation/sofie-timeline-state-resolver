import { SisyfosError, SisyfosErrorCode, SisyfosErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Sisyfos device errors with proper context.
 */
export function createSisyfosError<T extends SisyfosErrorCode>(
	code: T,
	context: SisyfosErrorContextMap[T]
): SisyfosError<T> {
	return {
		code,
		context,
	}
}
