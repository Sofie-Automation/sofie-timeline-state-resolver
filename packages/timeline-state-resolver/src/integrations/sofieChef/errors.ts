import { SofieChefStatusDetail, SofieChefStatusCode, SofieChefStatusContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating SofieChef device status details with proper context.
 */
export function createSofieChefStatusDetail<T extends SofieChefStatusCode>(
	code: T,
	context: SofieChefStatusContextMap[T]
): SofieChefStatusDetail<T> {
	return {
		code,
		context,
	}
}
