import { HyperdeckError, HyperdeckErrorCode, HyperdeckErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Hyperdeck device errors with proper context.
 */
export function createHyperdeckError<T extends HyperdeckErrorCode>(
	code: T,
	context: HyperdeckErrorContextMap[T]
): HyperdeckError<T> {
	return {
		code,
		context,
	}
}
