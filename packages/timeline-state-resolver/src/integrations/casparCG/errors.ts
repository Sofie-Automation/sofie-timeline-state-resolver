import type { CasparCGErrorCode, CasparCGErrorContextMap, CasparCGError } from 'timeline-state-resolver-types'

/**
 * Create a type-safe CasparCG error.
 *
 * TypeScript ensures the context matches the error code at compile time.
 *
 * @example
 * // Correct usage:
 * createCasparCGError(CasparCGErrorCode.DISCONNECTED, { deviceName: 'CasparCG 1', host: '192.168.1.10', port: 5250 })
 * createCasparCGError(CasparCGErrorCode.QUEUE_OVERFLOW, { deviceName: 'CasparCG 1', host: '192.168.1.10', port: 5250 })
 */
export function createCasparCGError<T extends CasparCGErrorCode>(
	code: T,
	context: CasparCGErrorContextMap[T]
): CasparCGError<T> {
	return { code, context }
}
