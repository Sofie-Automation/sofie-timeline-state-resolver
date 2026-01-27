import { DeviceType } from '../generated/index.js'

export enum TimelineContentTypeWebSocketClient {
	WEBSOCKET_MESSAGE = 'websocketMessage',
}

export interface TimelineContentWebSocketClientBase {
	deviceType: DeviceType.WEBSOCKET_CLIENT
	type: TimelineContentTypeWebSocketClient
}

export interface TimelineContentWebSocketMessage extends TimelineContentWebSocketClientBase {
	type: TimelineContentTypeWebSocketClient.WEBSOCKET_MESSAGE
	/**  Stringified data to send over Websocket connection */
	message: string
}

export type TimelineContentWebSocketClientAny = TimelineContentWebSocketMessage

export const WebSocketClientErrorCode = {
	NOT_CONNECTED: 'DEVICE_WEBSOCKET_CLIENT_NOT_CONNECTED',
	CONNECTION_FAILED: 'DEVICE_WEBSOCKET_CLIENT_CONNECTION_FAILED',
} as const
export type WebSocketClientErrorCode = (typeof WebSocketClientErrorCode)[keyof typeof WebSocketClientErrorCode]

export interface WebSocketClientErrorContextMap {
	[WebSocketClientErrorCode.NOT_CONNECTED]: {
		uri?: string
		reason?: string
	}
	[WebSocketClientErrorCode.CONNECTION_FAILED]: {
		uri?: string
		error?: string
		statusCode?: number
	}
}

export type WebSocketClientError<T extends WebSocketClientErrorCode = WebSocketClientErrorCode> = {
	code: T
	context: WebSocketClientErrorContextMap[T]
}

export const WebSocketClientErrorMessages: Record<WebSocketClientErrorCode, string> = {
	[WebSocketClientErrorCode.NOT_CONNECTED]: 'WS Disconnected: {{uri}} ({{reason}})',
	[WebSocketClientErrorCode.CONNECTION_FAILED]: 'WS Connection failed to {{uri}}: {{error}}',
}
