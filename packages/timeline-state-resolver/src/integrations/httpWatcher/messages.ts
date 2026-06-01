import {
	HTTPWatcherStatusDetail,
	HTTPWatcherStatusCode,
	HTTPWatcherStatusContextMap,
	HTTPWatcherStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating HTTPWatcher device status details
 */
export function createHTTPWatcherStatusDetail<T extends HTTPWatcherStatusCode>(
	code: T,
	context: HTTPWatcherStatusContextMap[T]
): HTTPWatcherStatusDetail<T> {
	return { code, context, message: interpolateTemplateString(HTTPWatcherStatusMessages[code] ?? code, context) }
}
