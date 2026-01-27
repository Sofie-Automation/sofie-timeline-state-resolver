import { PharosError, PharosErrorCode, PharosErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Pharos device errors
 */
export function createPharosError<T extends PharosErrorCode>(
	code: T,
	context: PharosErrorContextMap[T]
): PharosError<T> {
	return { code, context }
}
