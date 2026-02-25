import {
	TelemetricsStatusDetail,
	TelemetricsStatusCode,
	TelemetricsStatusContextMap,
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
	}
}
