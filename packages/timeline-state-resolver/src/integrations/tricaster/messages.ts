import {
	TriCasterStatusDetail,
	TriCasterStatusCode,
	TriCasterStatusContextMap,
	TriCasterStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating TriCaster device status details
 */
export function createTriCasterStatusDetail<T extends TriCasterStatusCode>(
	code: T,
	context: TriCasterStatusContextMap[T]
): TriCasterStatusDetail<T> {
	return { code, context, message: interpolateTemplateString(TriCasterStatusMessages[code] ?? code, context) }
}
