import {
	OSCStatusDetail,
	OSCStatusCode,
	OSCStatusContextMap,
	OSCStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating OSC device status details with proper context.
 */
export function createOSCStatusDetail<T extends OSCStatusCode>(
	code: T,
	context: OSCStatusContextMap[T]
): OSCStatusDetail<T> {
	return {
		code,
		context,
		message: interpolateTemplateString(OSCStatusMessages[code] ?? code, context),
	}
}
