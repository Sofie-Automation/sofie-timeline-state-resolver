import { TelemetricsError, TelemetricsErrorCode, TelemetricsErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Telemetrics device errors with proper context.
 */
export function createTelemetricsError<T extends TelemetricsErrorCode>(
	code: T,
	context: TelemetricsErrorContextMap[T]
): TelemetricsError<T> {
	return {
		code,
		context,
	}
}
