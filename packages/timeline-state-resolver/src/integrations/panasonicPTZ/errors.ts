import { PanasonicPTZError, PanasonicPTZErrorCode, PanasonicPTZErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating Panasonic PTZ device errors with proper context.
 */
export function createPanasonicPTZError<T extends PanasonicPTZErrorCode>(
	code: T,
	context: PanasonicPTZErrorContextMap[T]
): PanasonicPTZError<T> {
	return {
		code,
		context,
	}
}
