import {
	PanasonicPTZStatusDetail,
	PanasonicPTZStatusCode,
	PanasonicPTZStatusContextMap,
} from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Panasonic PTZ device errors with proper context.
 */
export function createPanasonicPTZStatusDetail<T extends PanasonicPTZStatusCode>(
	code: T,
	context: PanasonicPTZStatusContextMap[T]
): PanasonicPTZStatusDetail<T> {
	return {
		code,
		context,
	}
}
