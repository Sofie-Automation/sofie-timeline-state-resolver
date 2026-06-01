import {
	TelemetricsStatusDetail,
	TelemetricsStatusCode,
	TelemetricsStatusContextMap,
	TelemetricsStatusMessages,
	interpolateTemplateString,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Telemetrics device status details with proper context.
 */
export function createTelemetricsStatusDetail<T extends TelemetricsStatusCode>(
	code: T,
	context: TelemetricsStatusContextMap[T]
): TelemetricsStatusDetail<T> {
	return {
		code,
		context,
		message: interpolateTemplateString(TelemetricsStatusMessages[code] ?? code, context),
	}
}
