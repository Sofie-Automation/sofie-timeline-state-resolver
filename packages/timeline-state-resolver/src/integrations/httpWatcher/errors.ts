import { HTTPWatcherError, HTTPWatcherErrorCode, HTTPWatcherErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating HTTPWatcher device errors
 */
export function createHTTPWatcherError<T extends HTTPWatcherErrorCode>(
	code: T,
	context: HTTPWatcherErrorContextMap[T]
): HTTPWatcherError<T> {
	return { code, context }
}
