import { DeviceType, HTTPSendCommandContent, TemplateString } from '../index.js'

export type TimelineContentHTTPSendAny = TimelineContentHTTPRequest
export interface TimelineContentHTTPSendBase {
	deviceType: DeviceType.HTTPSEND
}

export interface HTTPSendCommandContentExt extends Omit<HTTPSendCommandContent, 'url'> {
	url: string | TemplateString
}

export type TimelineContentHTTPRequest = TimelineContentHTTPSendBase & HTTPSendCommandContentExt

/**
 * Action error codes for HTTP Send device actions.
 * These codes can be customized in blueprints via deviceActionErrorMessages.
 *
 * Error codes follow the pattern: ACTION_HTTPSEND_{REASON}
 */
export const HttpSendActionErrorCode = {
	/** SendCommand action was called without a payload */
	MISSING_PAYLOAD: 'ACTION_HTTPSEND_MISSING_PAYLOAD',
	/** SendCommand action payload is missing a URL */
	MISSING_URL: 'ACTION_HTTPSEND_MISSING_URL',
	/** SendCommand action payload has an invalid HTTP method type */
	INVALID_TYPE: 'ACTION_HTTPSEND_INVALID_TYPE',
	/** SendCommand action payload is missing params */
	MISSING_PARAMS: 'ACTION_HTTPSEND_MISSING_PARAMS',
	/** SendCommand action payload has an invalid params type */
	INVALID_PARAMS_TYPE: 'ACTION_HTTPSEND_INVALID_PARAMS_TYPE',
	/** HTTP request failed with a network error */
	REQUEST_FAILED: 'ACTION_HTTPSEND_REQUEST_FAILED',
} as const

export type HttpSendActionErrorCode = (typeof HttpSendActionErrorCode)[keyof typeof HttpSendActionErrorCode]

/**
 * Default human-readable messages for each HTTP Send action error code.
 * Used as fallback when no blueprint customization is present.
 */
export const HttpSendActionErrorMessages: Record<HttpSendActionErrorCode, string> = {
	[HttpSendActionErrorCode.MISSING_PAYLOAD]: 'Failed to send HTTP command: missing payload',
	[HttpSendActionErrorCode.MISSING_URL]: 'Failed to send HTTP command: missing URL',
	[HttpSendActionErrorCode.INVALID_TYPE]: 'Failed to send HTTP command: invalid HTTP method type',
	[HttpSendActionErrorCode.MISSING_PARAMS]: 'Failed to send HTTP command: missing params',
	[HttpSendActionErrorCode.INVALID_PARAMS_TYPE]: 'Failed to send HTTP command: invalid params type',
	[HttpSendActionErrorCode.REQUEST_FAILED]: 'HTTP request to {{url}} failed: {{errorMessage}}',
}

/**
 * Context data for each HTTP Send action error code.
 * These fields are available for message template interpolation.
 */
export interface HttpSendActionErrorContextMap {
	[HttpSendActionErrorCode.MISSING_PAYLOAD]: Record<string, never>
	[HttpSendActionErrorCode.MISSING_URL]: Record<string, never>
	[HttpSendActionErrorCode.INVALID_TYPE]: { type: string }
	[HttpSendActionErrorCode.MISSING_PARAMS]: { url: string }
	[HttpSendActionErrorCode.INVALID_PARAMS_TYPE]: { paramsType: string }
	[HttpSendActionErrorCode.REQUEST_FAILED]: { url: string; errorMessage: string; errorCode?: string }
}
