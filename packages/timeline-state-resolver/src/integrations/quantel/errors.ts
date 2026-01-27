import { QuantelError, QuantelErrorCode, QuantelErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Quantel device errors
 */
export function createQuantelError<T extends QuantelErrorCode>(
	code: T,
	context: QuantelErrorContextMap[T]
): QuantelError<T> {
	return { code, context }
}
