import { DeviceStatusDetail } from '../deviceStatusDetail.js'

export const HTTPWatcherStatusCode = {
	URI_NOT_SET: 'DEVICE_HTTPWATCHER_URI_NOT_SET',
	BAD_METHOD: 'DEVICE_HTTPWATCHER_BAD_METHOD',
	UNEXPECTED_STATUS_CODE: 'DEVICE_HTTPWATCHER_UNEXPECTED_STATUS_CODE',
	KEYWORD_NOT_FOUND: 'DEVICE_HTTPWATCHER_KEYWORD_NOT_FOUND',
	REQUEST_ERROR: 'DEVICE_HTTPWATCHER_REQUEST_ERROR',
} as const
export type HTTPWatcherStatusCode = (typeof HTTPWatcherStatusCode)[keyof typeof HTTPWatcherStatusCode]

export interface HTTPWatcherStatusContextMap {
	[HTTPWatcherStatusCode.URI_NOT_SET]: Record<string, never>
	[HTTPWatcherStatusCode.BAD_METHOD]: { method: string }
	[HTTPWatcherStatusCode.UNEXPECTED_STATUS_CODE]: {
		expected: number
		actual: number
		uri: string
		body?: string
		headers?: Record<string, string | string[] | undefined>
	}
	[HTTPWatcherStatusCode.KEYWORD_NOT_FOUND]: {
		keyword: string
		uri: string
		body?: string
		statusCode?: number
	}
	[HTTPWatcherStatusCode.REQUEST_ERROR]: {
		error: string
		uri?: string
		statusCode?: number
		body?: string
	}
}

export type HTTPWatcherStatusDetail<T extends HTTPWatcherStatusCode = HTTPWatcherStatusCode> = DeviceStatusDetail<
	T,
	HTTPWatcherStatusContextMap[T]
>

export const HTTPWatcherStatusMessages: Record<HTTPWatcherStatusCode, string> = {
	[HTTPWatcherStatusCode.URI_NOT_SET]: 'URI not set',
	[HTTPWatcherStatusCode.BAD_METHOD]: 'Bad request method: "{{method}}"',
	[HTTPWatcherStatusCode.UNEXPECTED_STATUS_CODE]: 'Expected status code {{expected}}, got {{actual}}',
	[HTTPWatcherStatusCode.KEYWORD_NOT_FOUND]: 'Expected keyword "{{keyword}}" not found',
	[HTTPWatcherStatusCode.REQUEST_ERROR]: '{{error}}',
}
