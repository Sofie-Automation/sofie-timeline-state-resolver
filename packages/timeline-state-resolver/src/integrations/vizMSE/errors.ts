import { VizMSEError, VizMSEErrorCode, VizMSEErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Viz MSE device errors with proper context.
 */
export function createVizMSEError<T extends VizMSEErrorCode>(
	code: T,
	context: VizMSEErrorContextMap[T]
): VizMSEError<T> {
	return {
		code,
		context,
	}
}
