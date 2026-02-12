import { OBSStatusDetail, OBSStatusCode, OBSStatusContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating OBS device status details with proper context.
 */
export function createOBSStatusDetail<T extends OBSStatusCode>(
	code: T,
	context: OBSStatusContextMap[T]
): OBSStatusDetail<T> {
	return {
		code,
		context,
	}
}
