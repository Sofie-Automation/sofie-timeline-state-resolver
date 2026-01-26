import type { VMixErrorCode, VMixErrorContextMap, VMixError } from 'timeline-state-resolver-types'

/**
 * Create a type-safe VMix error.
 *
 * TypeScript ensures the context matches the error code at compile time.
 *
 * @example
 * // Correct usage:
 * createVMixError(VMixErrorCode.NOT_CONNECTED, { deviceName: 'VMix 1', host: '192.168.1.10' })
 * createVMixError(VMixErrorCode.NOT_INITIALIZED, { deviceName: 'VMix 1', host: '192.168.1.10' })
 */
export function createVMixError<T extends VMixErrorCode>(code: T, context: VMixErrorContextMap[T]): VMixError<T> {
	return { code, context }
}
