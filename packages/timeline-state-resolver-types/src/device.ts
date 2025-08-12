import type { DeviceType } from '.'
import type { DeviceCommonOptions } from './generated/common-options'

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
	messages: Array<string>
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
