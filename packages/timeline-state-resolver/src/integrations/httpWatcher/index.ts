import {
	TimelineContentTypeHTTP,
	HttpWatcherOptions,
	StatusCode,
	DeviceStatus,
	HttpWatcherDeviceTypes,
	HttpMethod,
	HTTPWatcherError,
	HTTPWatcherErrorCode,
	HTTPWatcherErrorMessages,
} from 'timeline-state-resolver-types'
import got, { Headers, Response } from 'got'
import type { Device, CommandWithContext, DeviceContextAPI } from 'timeline-state-resolver-api'
import { createHTTPWatcherError } from './errors'
import { errorsToMessages } from '../../deviceErrorMessages'

type HTTPWatcherDeviceState = Record<string, never>

type HTTPWatcherCommandWithContext = CommandWithContext<never, never>

/**
 * This is a HTTPWatcherDevice, requests a uri on a regular interval and watches
 * it's response.
 */
export class HTTPWatcherDevice
	implements Device<HttpWatcherDeviceTypes, HTTPWatcherDeviceState, HTTPWatcherCommandWithContext>
{
	readonly actions = null

	private uri?: string
	/** Setup in init */
	private httpMethod!: TimelineContentTypeHTTP
	private expectedHttpResponse: number | undefined
	private headers?: Headers
	private keyword: string | undefined
	/** Setup in init */
	private intervalTime!: number
	private interval: NodeJS.Timeout | undefined
	private status: StatusCode = StatusCode.UNKNOWN
	private errors: HTTPWatcherError[] = []

	constructor(protected context: DeviceContextAPI<HTTPWatcherDeviceState>) {
		// Nothing
	}

	private onInterval() {
		if (!this.uri) {
			this._setStatus(StatusCode.BAD, [createHTTPWatcherError(HTTPWatcherErrorCode.URI_NOT_SET, {})])
			return
		}

		const reqMethod = got[this.httpMethod]
		if (reqMethod) {
			reqMethod(this.uri, {
				headers: this.headers,
			})
				.then((response) => this.handleResponse(response))
				.catch((error) => {
					const context: any = {
						error: error.toString() || 'Unknown',
						uri: this.uri,
					}
					if (error.response) {
						context.statusCode = error.response.statusCode
						context.body = error.response.body
					}
					this._setStatus(StatusCode.BAD, [createHTTPWatcherError(HTTPWatcherErrorCode.REQUEST_ERROR, context)])
				})
		} else {
			this._setStatus(StatusCode.BAD, [
				createHTTPWatcherError(HTTPWatcherErrorCode.BAD_METHOD, { method: this.httpMethod }),
			])
		}
	}
	private stopInterval() {
		if (this.interval) {
			clearInterval(this.interval)
			this.interval = undefined
		}
	}
	private startInterval() {
		this.stopInterval()
		this.interval = setInterval(() => this.onInterval(), this.intervalTime)
		// Also do a check right away:
		setTimeout(() => this.onInterval(), 300)
	}

	private handleResponse(response: Response<string>) {
		if (this.expectedHttpResponse && this.expectedHttpResponse !== response.statusCode) {
			this._setStatus(StatusCode.BAD, [
				createHTTPWatcherError(HTTPWatcherErrorCode.UNEXPECTED_STATUS_CODE, {
					expected: this.expectedHttpResponse,
					actual: response.statusCode,
					uri: this.uri!,
					body: response.body,
					headers: response.headers,
				}),
			])
		} else if (this.keyword && response.body && response.body.indexOf(this.keyword) === -1) {
			this._setStatus(StatusCode.BAD, [
				createHTTPWatcherError(HTTPWatcherErrorCode.KEYWORD_NOT_FOUND, {
					keyword: this.keyword,
					uri: this.uri!,
					body: response.body,
					statusCode: response.statusCode,
				}),
			])
		} else {
			this._setStatus(StatusCode.GOOD, [])
		}
	}

	async init(options: HttpWatcherOptions): Promise<boolean> {
		switch (options.httpMethod) {
			case HttpMethod.POST:
				this.httpMethod = TimelineContentTypeHTTP.POST
				break
			case HttpMethod.DELETE:
				this.httpMethod = TimelineContentTypeHTTP.DELETE
				break
			case HttpMethod.PUT:
				this.httpMethod = TimelineContentTypeHTTP.PUT
				break
			case HttpMethod.GET:
			case undefined:
			default:
				this.httpMethod = TimelineContentTypeHTTP.GET
				break
		}

		this.expectedHttpResponse = Number(options.expectedHttpResponse) || undefined
		this.headers = options.headers
		this.keyword = options.keyword
		this.intervalTime = Math.max(Number(options.interval) || 1000, 1000)
		this.uri = options.uri

		this.startInterval()

		return Promise.resolve(true)
	}

	async terminate(): Promise<void> {
		this.stopInterval()
	}

	getStatus(): Omit<DeviceStatus, 'active'> {
		return {
			statusCode: this.status,
			messages: errorsToMessages(this.errors, HTTPWatcherErrorMessages),
			errors: this.errors,
		}
	}
	private _setStatus(status: StatusCode, errors: HTTPWatcherError[]) {
		const errorsChanged = JSON.stringify(this.errors) !== JSON.stringify(errors)
		if (this.status !== status || errorsChanged) {
			this.status = status
			this.errors = errors

			this.context.connectionChanged(this.getStatus())
		}
	}

	get connected(): boolean {
		return false
	}

	convertTimelineStateToDeviceState(): HTTPWatcherDeviceState {
		// Noop
		return {}
	}
	diffStates(): Array<HTTPWatcherCommandWithContext> {
		// Noop
		return []
	}
	async sendCommand(): Promise<void> {
		// Noop
	}
}
