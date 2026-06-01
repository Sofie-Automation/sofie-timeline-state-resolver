import {
	WebSocketClientStatusDetail,
	WebSocketClientStatusCode,
	WebSocketClientStatusContextMap,
	WebSocketClientStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating WebSocketClient device status details
 */
export function createWebSocketClientStatusDetail<T extends WebSocketClientStatusCode>(
	code: T,
	context: WebSocketClientStatusContextMap[T]
): WebSocketClientStatusDetail<T> {
	return { code, context, message: interpolateTemplateString(WebSocketClientStatusMessages[code] ?? code, context) }
}
