import type { DeviceType } from '.'
import type { DeviceCommonOptions } from './generated/common-options'
import type { DeviceStatusError } from './deviceError'

export enum StatusCode {
	UNKNOWN = 0, // Status unknown
	GOOD = 1, // All good and green
	WARNING_MINOR = 2, // Everything is not OK, operation is not affected
	WARNING_MAJOR = 3, // Everything is not OK, operation might be affected
	BAD = 4, // Operation affected, possible to recover
	FATAL = 5, // Operation affected, not possible to recover without manual interference
}
export interface DeviceStatus {
	statusCode: StatusCode
	/**
	 * Human-readable status messages.
	 * Devices populate this from their errors array using default templates.
	 * Maintained for backward compatibility with consumers that don't use structured errors.
	 */
	messages: Array<string>
	/**
	 * Structured error information for customizable error messages.
	 * Each error contains a code (e.g., 'DEVICE_ATEM_DISCONNECTED') and context
	 * for message interpolation (e.g., { host: '192.168.1.10' }).
	 * Consuming applications can override default messages by providing custom templates
	 * using the `errorsToMessages()` function with custom template strings.
	 * See `interpolateTemplateString()` and `errorsToMessages()` for template interpolation utilities.
	 */
	errors?: Array<DeviceStatusError>
	active: boolean
}

export interface DeviceOptionsBase<T> extends SlowReportOptions, DeviceCommonOptions {
	type: DeviceType
	isMultiThreaded?: boolean
	reportAllCommands?: boolean
	options?: T
}

export interface SlowReportOptions {
	/** If set, report back that a command was slow if not sent at this time */
	limitSlowSentCommand?: number
	/** If set, report back that a command was slow if not fullfilled (sent + ack:ed) at this time */
	limitSlowFulfilledCommand?: number
}
