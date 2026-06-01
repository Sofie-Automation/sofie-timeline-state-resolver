import {
	PanasonicPTZStatusDetail,
	PanasonicPTZStatusCode,
	PanasonicPTZStatusContextMap,
	PanasonicPTZStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Panasonic PTZ status details with proper context.
 */
export function createPanasonicPTZStatusDetail<T extends PanasonicPTZStatusCode>(
	code: T,
	context: PanasonicPTZStatusContextMap[T]
): PanasonicPTZStatusDetail<T> {
	return {
		code,
		context,
		message: interpolateTemplateString(PanasonicPTZStatusMessages[code] ?? code, context),
	}
}
