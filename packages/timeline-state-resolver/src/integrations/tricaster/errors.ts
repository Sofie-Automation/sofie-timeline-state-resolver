import { TriCasterStatusDetail, TriCasterStatusCode, TriCasterStatusContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating TriCaster device status details
 */
export function createTriCasterStatusDetail<T extends TriCasterStatusCode>(
	code: T,
	context: TriCasterStatusContextMap[T]
): TriCasterStatusDetail<T> {
	return { code, context }
}
