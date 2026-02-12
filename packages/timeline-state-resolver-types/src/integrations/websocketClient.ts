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

export const WebSocketClientStatusCode = {
	NOT_CONNECTED: 'DEVICE_WEBSOCKET_CLIENT_NOT_CONNECTED',
	CONNECTION_FAILED: 'DEVICE_WEBSOCKET_CLIENT_CONNECTION_FAILED',
} as const
export type WebSocketClientStatusCode = (typeof WebSocketClientStatusCode)[keyof typeof WebSocketClientStatusCode]

export interface WebSocketClientStatusContextMap {
	[WebSocketClientStatusCode.NOT_CONNECTED]: {
		uri?: string
		reason?: string
	}
	[WebSocketClientStatusCode.CONNECTION_FAILED]: {
		uri?: string
		error?: string
		statusCode?: number
	}
}

export type WebSocketClientStatusDetail<T extends WebSocketClientStatusCode = WebSocketClientStatusCode> = {
	code: T
	context: WebSocketClientStatusContextMap[T]
}

export const WebSocketClientStatusMessages: Record<WebSocketClientStatusCode, string> = {
	[WebSocketClientStatusCode.NOT_CONNECTED]: 'WS Disconnected: {{uri}} ({{reason}})',
	[WebSocketClientStatusCode.CONNECTION_FAILED]: 'WS Connection failed to {{uri}}: {{error}}',
}
