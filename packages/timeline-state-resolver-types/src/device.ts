import type { DeviceType } from './index.js'
import type { DeviceCommonOptions } from './generated/common-options.js'
import type { DeviceStatusDetail } from './deviceError.js'

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
	 * Structured status details for customizable status messages.
	 * Each detail contains a code (e.g., 'DEVICE_ATEM_DISCONNECTED') and context
	 * for message interpolation (e.g., { host: '192.168.1.10' }).
	 * Contains both errors and warnings - "detail" is used because not all statuses
	 * are true errors (e.g., disconnect is recoverable).
	 * Consuming applications can override default messages by providing custom templates
	 * using the `statusDetailsToMessages()` function with custom template strings.
	 * See `interpolateTemplateString()` and `statusDetailsToMessages()` for template interpolation utilities.
	 */
	statusDetails?: Array<DeviceStatusDetail>
	active: boolean
}

export interface DeviceOptionsBase<TType extends DeviceType, TOptions> extends SlowReportOptions, DeviceCommonOptions {
	type: TType
	isMultiThreaded?: boolean
	reportAllCommands?: boolean
	options?: TOptions
}

export interface SlowReportOptions {
	/** If set, report back that a command was slow if not sent at this time */
	limitSlowSentCommand?: number
	/** If set, report back that a command was slow if not fullfilled (sent + ack:ed) at this time */
	limitSlowFulfilledCommand?: number
}
