import { PharosStatusDetail, PharosStatusCode, PharosStatusContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Pharos device status details
 */
export function createPharosStatusDetail<T extends PharosStatusCode>(
	code: T,
	context: PharosStatusContextMap[T]
): PharosStatusDetail<T> {
	return { code, context }
}
