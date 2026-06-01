import {
	LawoStatusDetail,
	LawoStatusCode,
	LawoStatusContextMap,
	LawoStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Lawo device status details
 */
export function createLawoStatusDetail<T extends LawoStatusCode>(
	code: T,
	context: LawoStatusContextMap[T]
): LawoStatusDetail<T> {
	return { code, context, message: interpolateTemplateString(LawoStatusMessages[code] ?? code, context) }
}
