import { QuantelStatusDetail, QuantelStatusCode, QuantelStatusContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Quantel device status details
 */
export function createQuantelStatusDetail<T extends QuantelStatusCode>(
	code: T,
	context: QuantelStatusContextMap[T]
): QuantelStatusDetail<T> {
	return { code, context }
}
