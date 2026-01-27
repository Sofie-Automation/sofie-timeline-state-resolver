import {
	WebSocketClientError,
	WebSocketClientErrorCode,
	WebSocketClientErrorContextMap,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating WebSocketClient device errors
 */
export function createWebSocketClientError<T extends WebSocketClientErrorCode>(
	code: T,
	context: WebSocketClientErrorContextMap[T]
): WebSocketClientError<T> {
	return { code, context }
}
