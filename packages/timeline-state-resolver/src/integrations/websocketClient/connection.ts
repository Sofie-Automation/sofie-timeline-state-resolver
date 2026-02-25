import WebSocket from 'ws'
import {
	DeviceStatus,
	statusDetailsToMessages,
	StatusCode,
	WebsocketClientOptions,
	WebSocketClientStatusDetail,
	WebSocketClientStatusCode,
	WebSocketClientStatusMessages,
} from 'timeline-state-resolver-types'
import { createWebSocketClientStatusDetail } from './messages.js'

export class WebSocketConnection {
	private ws?: WebSocket
	private isWsConnected = false
	private readonly options: WebsocketClientOptions
	private lastError?: { error: string; uri?: string }
	private disconnectReason?: string

	constructor(options: WebsocketClientOptions) {
		this.options = options
	}

	async connect(): Promise<void> {
		try {
			// WebSocket connection
			if (this.options.webSocket?.uri) {
				this.ws = new WebSocket(this.options.webSocket.uri, this.options.bufferEncoding || 'utf8')

				await new Promise<void>((resolve, reject) => {
					if (!this.ws) return reject(new Error('WebSocket not initialized'))

					const timeout = setTimeout(() => {
						reject(new Error('WebSocket connection timeout'))
					}, this.options.webSocket?.reconnectInterval || 5000)

					this.ws.on('open', () => {
						clearTimeout(timeout)
						this.isWsConnected = true
						this.lastError = undefined
						this.disconnectReason = undefined
						resolve()
					})

					this.ws.on('error', (error) => {
						clearTimeout(timeout)
						this.lastError = {
							error: error.message || error.toString(),
							uri: this.options.webSocket?.uri,
						}
						reject(error)
					})
				})

				this.ws.on('close', (code, reason) => {
					this.isWsConnected = false
					this.disconnectReason = reason ? reason.toString() : code ? `Code ${code}` : undefined
				})
			}
		} catch (error) {
			this.isWsConnected = false
			this.lastError = {
				error: error instanceof Error ? error.message : String(error),
				uri: this.options.webSocket?.uri,
			}
			throw error
		}
	}

	connected(): boolean {
		return this.isWsConnected ? true : false
	}

	connectionStatus(): Omit<DeviceStatus, 'active'> {
		const statusDetails: WebSocketClientStatusDetail[] = []

		if (!this.isWsConnected) {
			if (this.lastError) {
				statusDetails.push(
					createWebSocketClientStatusDetail(WebSocketClientStatusCode.CONNECTION_FAILED, {
						uri: this.lastError.uri,
						error: this.lastError.error,
					})
				)
			} else {
				statusDetails.push(
					createWebSocketClientStatusDetail(WebSocketClientStatusCode.NOT_CONNECTED, {
						uri: this.options.webSocket?.uri,
						reason: this.disconnectReason,
					})
				)
			}
		}

		return {
			statusCode: this.isWsConnected ? StatusCode.GOOD : StatusCode.BAD,
			messages: statusDetailsToMessages(statusDetails, WebSocketClientStatusMessages),
			statusDetails,
		}
	}

	sendWebSocketMessage(message: string | Buffer): void {
		if (!this.ws) {
			this.isWsConnected = false
			throw new Error('WebSocket not connected')
		}
		this.ws.send(message)
	}

	async disconnect(): Promise<void> {
		if (this.ws) {
			this.ws.close()
			this.ws = undefined
		}

		this.isWsConnected = false
	}
}
