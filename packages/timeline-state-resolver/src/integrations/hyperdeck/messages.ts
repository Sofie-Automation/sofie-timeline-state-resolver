import {
	HyperdeckStatusDetail,
	HyperdeckStatusCode,
	HyperdeckStatusContextMap,
	HyperdeckStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Hyperdeck device status details with proper context.
 */
export function createHyperdeckStatusDetail<T extends HyperdeckStatusCode>(
	code: T,
	context: HyperdeckStatusContextMap[T]
): HyperdeckStatusDetail<T> {
	return {
		code,
		context,
		message: interpolateTemplateString(HyperdeckStatusMessages[code] ?? code, context),
	}
}
