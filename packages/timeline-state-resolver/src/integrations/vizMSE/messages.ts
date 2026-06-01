import {
	VizMSEStatusDetail,
	VizMSEStatusCode,
	VizMSEStatusContextMap,
	VizMSEStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Viz MSE status details with proper context.
 */
export function createVizMSEStatusDetail<T extends VizMSEStatusCode>(
	code: T,
	context: VizMSEStatusContextMap[T]
): VizMSEStatusDetail<T> {
	return {
		code,
		context,
		message: interpolateTemplateString(VizMSEStatusMessages[code] ?? code, context),
	}
}
