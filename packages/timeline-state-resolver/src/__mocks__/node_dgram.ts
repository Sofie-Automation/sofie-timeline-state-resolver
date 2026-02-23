import { EventEmitter } from 'events'

const sockets: Array<Socket> = []
const onNextSocket: Array<(s: Socket) => void> = []

const orgSetImmediate = setImmediate

export class Socket extends EventEmitter {
	public onSend: ((buff: Buffer) => void) | undefined
	public onConnect: ((port: number, host: string) => void) | undefined
	public onClose: (() => void) | undefined

	private _connected = false
	public destroyed = false

	constructor() {
		super()

		const cb = onNextSocket.shift()
		if (cb) {
			cb(this)
		}

		sockets.push(this)
	}

	public static mockSockets() {
		return sockets
	}
	public static openSockets() {
		return sockets.filter((s) => !s.destroyed)
	}
	public static mockOnNextSocket(cb: (s: Socket) => void) {
		onNextSocket.push(cb)
	}
	public static clearMockOnNextSocket() {
		onNextSocket.splice(0, 99999)
	}

	public connect(port: number, host?: string, cb?: () => void) {
		// UDP connect is just setting default destination
		if (this.onConnect) this.onConnect(port, host ?? 'localhost')
		orgSetImmediate(() => {
			if (cb) {
				cb()
			}
			this.setConnected()
		})
	}

	public send(buf: Buffer, cb?: (error: Error | null) => void)
	public send(buf: Buffer, offset: number, length: number, cb?: (error: Error | null) => void)
	public send(
		buf: Buffer,
		offsetOrCb?: number | ((error: Error | null) => void),
		_length?: number,
		cb?: (error: Error | null) => void
	) {
		cb = typeof offsetOrCb === 'function' ? offsetOrCb : cb
		if (this.onSend) {
			this.onSend(buf)
		}
		if (cb) cb(null)
	}

	public close(cb?: () => void) {
		this.setClosed()
		if (cb) cb()
	}

	public mockClose() {
		this.setClosed()
	}

	public destroy() {
		this.destroyed = true
	}

	private setConnected() {
		if (this._connected !== true) {
			this._connected = true
		}
		this.emit('connect')
	}

	private setClosed() {
		if (this._connected !== false) {
			this._connected = false
		}
		this.destroyed = true
		this.emit('close')
		if (this.onClose) this.onClose()
	}
}

export function createSocket(_type: 'udp4' | 'udp6'): Socket {
	return new Socket()
}

export default {
	createSocket,
	Socket,
}
