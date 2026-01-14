import type { AtemErrorCode, AtemErrorContextMap, AtemError } from 'timeline-state-resolver-types'

/**
 * Create a type-safe ATEM error.
 *
 * TypeScript ensures the context matches the error code at compile time.
 * For example, PSU_FAULT requires { deviceName, host, psuNumber, totalPsus }.
 *
 * @example
 * // Correct usage:
 * createAtemError(AtemErrorCode.DISCONNECTED, { deviceName: 'Studio ATEM', host: '192.168.1.10' })
 * createAtemError(AtemErrorCode.PSU_FAULT, { deviceName: 'Studio ATEM', host: '192.168.1.10', psuNumber: 2, totalPsus: 2 })
 *
 * // TypeScript error - wrong context for code:
 * createAtemError(AtemErrorCode.DISCONNECTED, { psuNumber: 1, totalPsus: 2 })
 */
export function createAtemError<T extends AtemErrorCode>(code: T, context: AtemErrorContextMap[T]): AtemError<T> {
	return { code, context }
}
