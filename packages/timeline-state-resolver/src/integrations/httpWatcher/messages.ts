import {
	HTTPWatcherStatusDetail,
	HTTPWatcherStatusCode,
	HTTPWatcherStatusContextMap,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating HTTPWatcher device status details
 */
export function createHTTPWatcherStatusDetail<T extends HTTPWatcherStatusCode>(
	code: T,
	context: HTTPWatcherStatusContextMap[T]
): HTTPWatcherStatusDetail<T> {
	return { code, context }
}
