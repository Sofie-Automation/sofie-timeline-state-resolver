import type { AtemStatusCode, AtemStatusContextMap, AtemStatusDetail } from 'timeline-state-resolver-types'

/**
 * Create a type-safe ATEM status detail.
 *
 * TypeScript ensures the context matches the status code at compile time.
 * For example, PSU_FAULT requires { deviceName, host, psuNumber, totalPsus }.
 *
 * @example
 * // Correct usage:
 * createAtemStatusDetail(AtemStatusCode.DISCONNECTED, { deviceName: 'Studio ATEM', host: '192.168.1.10' })
 * createAtemStatusDetail(AtemStatusCode.PSU_FAULT, { deviceName: 'Studio ATEM', host: '192.168.1.10', psuNumber: 2, totalPsus: 2 })
 *
 * // TypeScript error - wrong context for status code:
 * createAtemStatusDetail(AtemStatusCode.DISCONNECTED, { psuNumber: 1, totalPsus: 2 })
 */
export function createAtemStatusDetail<T extends AtemStatusCode>(
	code: T,
	context: AtemStatusContextMap[T]
): AtemStatusDetail<T> {
	return { code, context }
}
