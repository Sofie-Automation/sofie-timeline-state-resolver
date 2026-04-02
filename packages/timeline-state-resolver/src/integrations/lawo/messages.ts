import { LawoStatusDetail, LawoStatusCode, LawoStatusContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Lawo device status details
 */
export function createLawoStatusDetail<T extends LawoStatusCode>(
	code: T,
	context: LawoStatusContextMap[T]
): LawoStatusDetail<T> {
	return { code, context }
}
