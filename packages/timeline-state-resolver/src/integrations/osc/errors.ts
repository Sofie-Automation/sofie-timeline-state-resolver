import { OSCError, OSCErrorCode, OSCErrorContextMap } from 'timeline-state-resolver-types'

/**
 * Type-safe helper for creating OSC device errors with proper context.
 */
export function createOSCError<T extends OSCErrorCode>(code: T, context: OSCErrorContextMap[T]): OSCError<T> {
	return {
		code,
		context,
	}
}
