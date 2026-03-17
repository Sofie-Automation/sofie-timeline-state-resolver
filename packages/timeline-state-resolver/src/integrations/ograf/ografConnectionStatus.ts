import { EventEmitter } from 'node:events'
import { OgrafApi } from './ografApi.js'

/** A helper that pings an ograf server to checks connectivity */
export class OGrafConnectionStatus extends EventEmitter<OGrafConnectionStatusEvents> {
	private readonly checkIntervalMs = 5000
	private checkInterval: ReturnType<typeof setInterval> | undefined
	private checking = false
	private active = false
	private _connected = false

	constructor(private ografApi: OgrafApi) {
		super()
	}

	get connected(): boolean {
		return this._connected
	}

	public init() {
		if (this.active) return

		this.active = true

		void this.checkConnection()
		this.checkInterval = setInterval(() => {
			void this.checkConnection()
		}, this.checkIntervalMs)
	}
	public terminate() {
		this.active = false
		if (this.checkInterval) {
			clearInterval(this.checkInterval)
			this.checkInterval = undefined
		}
	}

	private async checkConnection() {
		if (!this.active || this.checking) return

		this.checking = true
		try {
			await this.ografApi.getServerInfo()

			if (!this.active) return
			if (!this._connected) {
				this._connected = true
				this.emit('connected')
			}
		} catch (err) {
			if (!this.active) return

			if (this._connected) {
				this._connected = false
				this.emit('disconnected')
			}

			if (!this.isExpectedConnectionIssue(err)) {
				this.emit('error', err instanceof Error ? err : new Error(String(err)))
			}
		} finally {
			this.checking = false
		}
	}

	private isExpectedConnectionIssue(err: unknown): boolean {
		const errStr = `${err}`

		for (const expectedCode of [
			'ETIMEDOUT',
			'ESOCKETTIMEDOUT',
			'ECONNREFUSED',
			'ECONNRESET',
			'EHOSTUNREACH',
			'ENETUNREACH',
			'ENOTFOUND',
			'EAI_AGAIN',
		]) {
			if (errStr.includes(expectedCode)) {
				return true
			}
		}

		if (err instanceof Error) {
			const message = err.message.toLowerCase()
			if (message.includes('timeout') || message.includes('timed out')) {
				return true
			}
		}

		return false
	}
}
export type OGrafConnectionStatusEvents = {
	connected: []
	disconnected: []
	error: [err: Error]
}
