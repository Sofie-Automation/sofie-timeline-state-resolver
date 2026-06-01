import type { DeviceTypeExt } from './index.js'
import type { DeviceCommonOptions } from './generated/common-options.js'
import type { DeviceStatusDetail } from './deviceStatusDetail.js'

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
	 * Derived from statusDetails[].message at the TSR boundary, or provided directly by legacy devices.
	 */
	messages: Array<string>

	/**
	 * Structured status details.
	 * Each detail carries a pre-rendered message and, for devices that support it, a status code
	 * and context object that consumers can use to apply custom message templates via
	 * interpolateTemplateString().
	 */
	statusDetails?: Array<DeviceStatusDetail>
	active: boolean
}

/**
 * What a device's getStatus() may return.
 * Devices that have been migrated return { statusCode, statusDetails }.
 * Legacy or simple devices may return { statusCode, messages }.
 * TSR normalises this to DeviceStatus at the connectionChanged boundary.
 */
export type DeviceStatusInput =
	| { statusCode: StatusCode; messages: Array<string> }
	| { statusCode: StatusCode; statusDetails: Array<DeviceStatusDetail> }

export interface DeviceOptionsBase<TType extends DeviceTypeExt, TOptions>
	extends SlowReportOptions, DeviceCommonOptions {
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
