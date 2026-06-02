import type { ITranslatableMessage } from './translations.js'

/**
 * The result of executing a device action.
 *
 * On error, `response` is the pre-rendered human-readable fallback message. Consumers who want
 * to customise the message can use `code` and `context` to look up and interpolate a custom
 * template (e.g. from a blueprint's `deviceActionErrorMessages` map).
 *
 * Action error codes follow the pattern: ACTION_{DEVICETYPE}_{REASON}
 *
 * @example
 * // Device returns a structured error:
 * {
 *   result: ActionExecutionResultCode.Error,
 *   response: { key: 'CasparCG launcher host not configured' },
 *   code: 'ACTION_CASPARCG_LAUNCHER_HOST_NOT_SET',
 *   context: { deviceName: 'CasparCG 1', host: '192.168.1.10' },
 * }
 *
 * // Consumer applies a custom template:
 * interpolateTemplateString('{{deviceName}}: launcher host not set ({{host}})', result.context)
 */
export interface ActionExecutionResult<ResultData = void> {
	result: ActionExecutionResultCode
	/** Pre-rendered human-readable response message, intended to be displayed to a user */
	response?: ITranslatableMessage
	/** Response data */
	resultData?: ResultData
	/**
	 * Structured error code for customisable messages - typically ACTION_{DEVICETYPE}_{REASON}.
	 * Present on structured errors alongside `context`.
	 */
	code?: string
	/**
	 * Context for custom message interpolation via interpolateTemplateString().
	 * Present on structured errors alongside `code`.
	 */
	context?: Record<string, unknown>
}

export enum ActionExecutionResultCode {
	Error = 'ERROR',
	IgnoredNotRelevant = 'IGNORED',
	Ok = 'OK',
}

export type ActionPayloadType<AMethod extends (id: string, payload: any) => Promise<ActionExecutionResult<any>>> =
	Parameters<AMethod>[0]

export type ActionResultType<AMethod extends (id: string, payload: any) => Promise<ActionExecutionResult<any>>> =
	ReturnType<AMethod> extends Promise<ActionExecutionResult<infer R>> ? R : never
