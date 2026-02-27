import type { CasparCGStatusCode, CasparCGStatusContextMap, CasparCGStatusDetail } from 'timeline-state-resolver-types'

/**
 * Create a type-safe CasparCG status detail.
 *
 * TypeScript ensures the context matches the status code at compile time.
 *
 * @example
 * // Correct usage:
 * createCasparCGStatusDetail(CasparCGStatusCode.DISCONNECTED, { deviceName: 'CasparCG 1', host: '192.168.1.10', port: 5250 })
 * createCasparCGStatusDetail(CasparCGStatusCode.QUEUE_OVERFLOW, { deviceName: 'CasparCG 1', host: '192.168.1.10', port: 5250 })
 */
export function createCasparCGStatusDetail<T extends CasparCGStatusCode>(
	code: T,
	context: CasparCGStatusContextMap[T]
): CasparCGStatusDetail<T> {
	return { code, context }
}
