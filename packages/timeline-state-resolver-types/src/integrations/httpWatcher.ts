import { DeviceStatusError } from '../deviceError'

export const HTTPWatcherErrorCode = {
	URI_NOT_SET: 'DEVICE_HTTPWATCHER_URI_NOT_SET',
	BAD_METHOD: 'DEVICE_HTTPWATCHER_BAD_METHOD',
	UNEXPECTED_STATUS_CODE: 'DEVICE_HTTPWATCHER_UNEXPECTED_STATUS_CODE',
	KEYWORD_NOT_FOUND: 'DEVICE_HTTPWATCHER_KEYWORD_NOT_FOUND',
	REQUEST_ERROR: 'DEVICE_HTTPWATCHER_REQUEST_ERROR',
} as const
export type HTTPWatcherErrorCode = (typeof HTTPWatcherErrorCode)[keyof typeof HTTPWatcherErrorCode]

export interface HTTPWatcherErrorContextMap {
	[HTTPWatcherErrorCode.URI_NOT_SET]: Record<string, never>
	[HTTPWatcherErrorCode.BAD_METHOD]: { method: string }
	[HTTPWatcherErrorCode.UNEXPECTED_STATUS_CODE]: {
		expected: number
		actual: number
		uri: string
		body?: string
		headers?: Record<string, string | string[] | undefined>
	}
	[HTTPWatcherErrorCode.KEYWORD_NOT_FOUND]: {
		keyword: string
		uri: string
		body?: string
		statusCode?: number
	}
	[HTTPWatcherErrorCode.REQUEST_ERROR]: {
		error: string
		uri?: string
		statusCode?: number
		body?: string
	}
}

export type HTTPWatcherError<T extends HTTPWatcherErrorCode = HTTPWatcherErrorCode> = DeviceStatusError<
	T,
	HTTPWatcherErrorContextMap[T]
>

export const HTTPWatcherErrorMessages: Record<HTTPWatcherErrorCode, string> = {
	[HTTPWatcherErrorCode.URI_NOT_SET]: 'URI not set',
	[HTTPWatcherErrorCode.BAD_METHOD]: 'Bad request method: "{{method}}"',
	[HTTPWatcherErrorCode.UNEXPECTED_STATUS_CODE]: 'Expected status code {{expected}}, got {{actual}}',
	[HTTPWatcherErrorCode.KEYWORD_NOT_FOUND]: 'Expected keyword "{{keyword}}" not found',
	[HTTPWatcherErrorCode.REQUEST_ERROR]: '{{error}}',
}
