import { VizMSEStatusDetail, VizMSEStatusCode, VizMSEStatusContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Viz MSE device errors with proper context.
 */
export function createVizMSEStatusDetail<T extends VizMSEStatusCode>(
	code: T,
	context: VizMSEStatusContextMap[T]
): VizMSEStatusDetail<T> {
	return {
		code,
		context,
	}
}
