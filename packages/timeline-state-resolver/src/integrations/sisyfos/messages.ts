import {
	SisyfosStatusDetail,
	SisyfosStatusCode,
	SisyfosStatusContextMap,
	SisyfosStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Sisyfos device status details with proper context.
 */
export function createSisyfosStatusDetail<T extends SisyfosStatusCode>(
	code: T,
	context: SisyfosStatusContextMap[T]
): SisyfosStatusDetail<T> {
	return {
		code,
		context,
		message: interpolateTemplateString(SisyfosStatusMessages[code] ?? code, context),
	}
}
