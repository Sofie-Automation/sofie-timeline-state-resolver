import {
	QuantelStatusDetail,
	QuantelStatusCode,
	QuantelStatusContextMap,
	QuantelStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Quantel device status details
 */
export function createQuantelStatusDetail<T extends QuantelStatusCode>(
	code: T,
	context: QuantelStatusContextMap[T]
): QuantelStatusDetail<T> {
	return { code, context, message: interpolateTemplateString(QuantelStatusMessages[code] ?? code, context) }
}
