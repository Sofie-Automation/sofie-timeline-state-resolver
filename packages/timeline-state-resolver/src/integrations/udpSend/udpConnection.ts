import { EventEmitter } from 'node:events'
import { UdpSendOptions } from 'timeline-state-resolver-types'
import dgram from 'node:dgram'

const TIMEOUT = 5000 // ms

export interface UdpConnectionEvents {
	error: [context: string, error: Error]
}

export class UdpConnection extends EventEmitter<UdpConnectionEvents> {
	/**
	 * Is set when the connection is active.
	 * is set to undefined if disconnect() has been called (then do not try to reconnect)
	 */
	private activeOptions: UdpSendOptions | undefined = undefined
	#udpSocket: dgram.Socket | null = null

	async activate(options: UdpSendOptions): Promise<void> {
		if (this.activeOptions || this.#udpSocket) throw new Error('UDP connection already activated')
		this.activeOptions = options

		this.#udpSocket = dgram.createSocket('udp4')
		// Treat ICMP "port unreachable" (ECONNREFUSED / recvmsg ECONNREFUSED) as non-fatal for UDP.
		// Node surfaces that as an 'error' on the socket; ignore it so the sender can continue.
		this.#udpSocket.on('error', (err: NodeJS.ErrnoException) => {
			if (err && err.code === 'ECONNREFUSED') {
				// Ignore ECONNREFUSED (remote port not listening). Not fatal for UDP sends.
				return
			}
			this.emit('error', 'UDP socket error', err)
		})

		const udpSocket: dgram.Socket = this.#udpSocket
		await new Promise((resolve, reject) => {
			udpSocket.connect(options.port, options.host, () => {
				if (timer) clearTimeout(timer)
				resolve(udpSocket)
			})
			udpSocket.once('error', (err: NodeJS.ErrnoException) => {
				if (timer) clearTimeout(timer)

				// If the platform reports ECONNREFUSED here, treat it as non-fatal and continue.
				if (err && err.code === 'ECONNREFUSED') {
					// Resolve anyway; socket can still be used for sending UDP datagrams.
					resolve(udpSocket)
					return
				}
				reject(err)
			})
			const timer = setTimeout(() => {
				reject(new Error(`UDP timeout: Unable to connect to ${options.host}:${options.port}`))
			}, TIMEOUT)
		})
	}

	async deactivate(): Promise<void> {
		this.activeOptions = undefined // prevent reconnecting

		if (this.#udpSocket) {
			this.#udpSocket.close()
			this.#udpSocket.removeAllListeners()

			this.#udpSocket = null
		}
	}
	async sendUDPMessage(message: string): Promise<void> {
		if (!this.#udpSocket || !this.activeOptions) throw new Error('UDP connection not activated')

		const encodedMessage = Buffer.from(message, this.activeOptions.bufferEncoding)

		const udpSocket = this.#udpSocket
		await new Promise((resolve, reject) => {
			udpSocket.send(encodedMessage, (err) => {
				if (err) reject(err)
				else resolve(undefined)
			})
		})
	}
}
