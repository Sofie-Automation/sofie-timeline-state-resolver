import type { VMixStatusCode, VMixStatusContextMap, VMixStatusDetail } from 'timeline-state-resolver-types'

/**
 * Create a type-safe VMix status detail.
 *
 * TypeScript ensures the context matches the status code at compile time.
 *
 * @example
 * // Correct usage:
 * createVMixStatusDetail(VMixStatusCode.NOT_CONNECTED, { deviceName: 'VMix 1', host: '192.168.1.10' })
 * createVMixStatusDetail(VMixStatusCode.NOT_INITIALIZED, { deviceName: 'VMix 1', host: '192.168.1.10' })
 */
export function createVMixStatusDetail<T extends VMixStatusCode>(
	code: T,
	context: VMixStatusContextMap[T]
): VMixStatusDetail<T> {
	return { code, context }
}
