import { DeviceType, TimelineContentTCPSendAny } from 'timeline-state-resolver-types'
import { Socket as OrgSocket } from 'net'
import { Socket as MockSocket } from '../../../__mocks__/net.js'
import { TcpSendDevice, TcpSendDeviceState } from '../index.js'
import { getDeviceContext } from '../../__tests__/testlib.js'
import { literal } from '../../../lib.js'

jest.mock('net')

const SocketMock = OrgSocket as any as typeof MockSocket

// SocketMock.mockClose

const setTimeoutOrg = setTimeout

async function sleep(duration: number) {
	return new Promise((resolve) => {
		setTimeoutOrg(resolve, duration)
	})
}

async function getInitializedTcpDevice() {
	const dev = new TcpSendDevice(getDeviceContext())
	await dev.init({
		host: '192.168.0.254',
		port: 1234,
	})
	await sleep(10)
	return dev
}

describe('TCP-Send', () => {
	const onSocketCreate = jest.fn()
	const onConnection = jest.fn()
	const onSocketClose = jest.fn()
	const onSocketWrite = jest.fn()
	const onConnectionChanged = jest.fn()

	function setupSocketMock() {
		SocketMock.mockOnNextSocket((socket: any) => {
			onSocketCreate()

			socket.onConnect = onConnection
			socket.onWrite = onSocketWrite
			socket.onClose = onSocketClose
		})
	}
	beforeEach(() => {
		setupSocketMock()
	})
	afterEach(() => {
		const sockets = SocketMock.openSockets()
		// Destroy any lingering sockets, to prevent a failing test from affecting other tests:
		sockets.forEach((s) => s.destroy())

		SocketMock.clearMockOnNextSocket()
		onSocketCreate.mockClear()
		onConnection.mockClear()
		onSocketClose.mockClear()
		onSocketWrite.mockClear()
		onConnectionChanged.mockClear()

		// Just a check to ensure that the unit tests cleaned up the socket after themselves:
		// eslint-disable-next-line jest/no-standalone-expect
		expect(sockets).toHaveLength(0)
	})

	describe('diffState', () => {
		test('From undefined', async () => {
			const device = await getInitializedTcpDevice()
			const commands = device.diffStates(undefined, createTimelineState({}))
			expect(commands).toEqual([])
			await device.terminate()
		})
		test('Empty states', async () => {
			const device = await getInitializedTcpDevice()
			const commands = device.diffStates(createTimelineState({}), createTimelineState({}))
			expect(commands).toEqual([])
			await device.terminate()
		})
		test('New command', async () => {
			const device = await getInitializedTcpDevice()

			const content = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'hello world',
			})
			const commands = device.diffStates(
				createTimelineState({}),
				createTimelineState({
					layer0: {
						id: 'obj0',
						layer: 'layer0',
						content,
					},
				})
			)
			expect(commands).toEqual([
				{
					timelineObjId: 'obj0',
					context: `added: obj0`,
					command: {
						commandName: 'added',
						content,
						layer: 'layer0',
					},
				},
			])
			await device.terminate()
		})

		test('Changed command', async () => {
			const device = await getInitializedTcpDevice()

			const content0 = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'hello world',
			})
			const content1 = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'goodbye world',
			})
			const commands = device.diffStates(
				createTimelineState({
					layer0: {
						id: 'obj0',
						layer: 'layer0',
						content: content0,
					},
				}),
				createTimelineState({
					layer0: {
						id: 'obj1',
						layer: 'layer0',
						content: content1,
					},
				})
			)
			expect(commands).toEqual([
				{
					timelineObjId: 'obj1',
					context: `changed: obj1`,
					command: {
						commandName: 'changed',
						content: {
							...content1,
						},
						layer: 'layer0',
					},
				},
			])
			await device.terminate()
		})

		test('Removed command', async () => {
			const device = await getInitializedTcpDevice()

			const content = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'hello world',
			})
			const commands = device.diffStates(
				createTimelineState({
					layer0: {
						id: 'obj0',
						layer: 'layer0',
						content,
					},
				}),
				createTimelineState({})
			)
			expect(commands).toEqual([
				{
					timelineObjId: 'obj0',
					context: `removed: obj0`,
					command: {
						commandName: 'removed',
						content,
						layer: 'layer0',
					},
				},
			])
			await device.terminate()
		})
	})
	describe('Socket connection', () => {
		test('Connect', async () => {
			const device = await getInitializedTcpDevice()

			expect(device.connected).toBe(true)
			expect(onSocketCreate).toHaveBeenCalledTimes(1)
			expect(onConnection).toHaveBeenCalledTimes(1)
			expect(SocketMock.openSockets()).toHaveLength(1)
			expect(onSocketClose).toHaveBeenCalledTimes(0)
			expect(onSocketWrite).toHaveBeenCalledTimes(0)

			await device.terminate()
		})
		test('Disconnect', async () => {
			const device = await getInitializedTcpDevice()
			await device.terminate()

			expect(device.connected).toBe(false)
			expect(SocketMock.openSockets()).toHaveLength(0)
			expect(onSocketClose).toHaveBeenCalledTimes(1)
		})
		test('Lose connection and reconnect', async () => {
			const device = await getInitializedTcpDevice()

			expect(device.connected).toBe(true)

			const sockets = SocketMock.openSockets()
			expect(sockets).toHaveLength(1)

			// Simulate that the socket is closed:
			sockets[0].mockClose()
			await sleep(10)
			// The device should have disconnected:
			expect(device.connected).toBe(false)

			await sleep(600)

			// The device should have reconnected:
			expect(device.connected).toBe(true)

			await device.terminate()
		})
	})
	describe('sendCommand', () => {
		test('Send message', async () => {
			const device = await getInitializedTcpDevice()

			const content = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'hello world',
			})
			const commands = device.diffStates(
				createTimelineState({}),
				createTimelineState({
					layer0: {
						id: 'obj0',
						layer: 'layer0',
						content,
					},
				})
			)

			expect(commands).toHaveLength(1)
			await device.sendCommand(commands[0])

			expect(onSocketCreate).toHaveBeenCalledTimes(1)
			expect(SocketMock.openSockets()).toHaveLength(1)
			expect(onConnection).toHaveBeenCalledTimes(1)

			expect(onSocketWrite).toHaveBeenCalledTimes(1)
			expect(onSocketWrite.mock.calls[0][0]).toEqual(Buffer.from('hello world'))

			await device.terminate()
		})
		test('Send message when disconnected', async () => {
			setupSocketMock() // Add one more socket mock
			const device = await getInitializedTcpDevice()

			const content = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'hello world',
			})
			const commands = device.diffStates(
				createTimelineState({}),
				createTimelineState({
					layer0: {
						id: 'obj0',
						layer: 'layer0',
						content,
					},
				})
			)
			expect(commands).toHaveLength(1)

			// Simulate that the socket is closed:
			const sockets = SocketMock.openSockets()
			expect(sockets).toHaveLength(1)
			sockets[0].mockClose()
			await sleep(10)
			// The device should have disconnected:
			expect(device.connected).toBe(false)
			expect(SocketMock.openSockets()).toHaveLength(0)

			// Now, send a command. This should trigger an immediate reconnect:
			await device.sendCommand(commands[0])
			expect(device.connected).toBe(true)

			expect(SocketMock.openSockets()).toHaveLength(1)

			expect(onSocketWrite).toHaveBeenCalledTimes(1)
			expect(onSocketWrite.mock.calls[0][0]).toEqual(Buffer.from('hello world'))

			await device.terminate()
		})

		test('Send multiple messages', async () => {
			const device = await getInitializedTcpDevice()

			const content1 = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'message 1',
			})
			const content2 = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'message 2',
			})

			const commands = device.diffStates(
				createTimelineState({}),
				createTimelineState({
					layer0: {
						id: 'obj0',
						layer: 'layer0',
						content: content1,
					},
					layer1: {
						id: 'obj1',
						layer: 'layer1',
						content: content2,
					},
				})
			)

			expect(commands).toHaveLength(2)
			await device.sendCommand(commands[0])
			await device.sendCommand(commands[1])

			expect(onSocketWrite).toHaveBeenCalledTimes(2)
			expect(onSocketWrite.mock.calls[0][0]).toEqual(Buffer.from('message 1'))
			expect(onSocketWrite.mock.calls[1][0]).toEqual(Buffer.from('message 2'))

			await device.terminate()
		})

		test('Temporal priority sorting', async () => {
			const device = await getInitializedTcpDevice()

			const content1 = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'low priority',
				temporalPriority: 10,
			})
			const content2 = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'high priority',
				temporalPriority: 1,
			})

			const commands = device.diffStates(
				createTimelineState({}),
				createTimelineState({
					layer0: {
						id: 'obj0',
						layer: 'layer0',
						content: content1,
					},
					layer1: {
						id: 'obj1',
						layer: 'layer1',
						content: content2,
					},
				})
			)

			// High priority (lower number) should come first
			expect(commands).toHaveLength(2)
			expect(commands[0].command.content.temporalPriority).toBe(1)
			expect(commands[1].command.content.temporalPriority).toBe(10)

			await device.terminate()
		})
	})

	describe('Buffer encoding', () => {
		test('Default encoding (utf8)', async () => {
			const device = await getInitializedTcpDevice()

			const content = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'test message',
			})
			const commands = device.diffStates(
				createTimelineState({}),
				createTimelineState({
					layer0: { id: 'obj0', layer: 'layer0', content },
				})
			)

			await device.sendCommand(commands[0])

			expect(onSocketWrite).toHaveBeenCalledTimes(1)
			expect(onSocketWrite.mock.calls[0][0]).toEqual(Buffer.from('test message', 'utf8'))

			await device.terminate()
		})

		test('ASCII encoding', async () => {
			const dev = new TcpSendDevice(getDeviceContext())
			await dev.init({
				host: '192.168.0.254',
				port: 1234,
				bufferEncoding: 'ascii',
			})
			await sleep(10)

			const content = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: 'test',
			})
			const commands = dev.diffStates(
				createTimelineState({}),
				createTimelineState({
					layer0: { id: 'obj0', layer: 'layer0', content },
				})
			)

			await dev.sendCommand(commands[0])

			expect(onSocketWrite.mock.calls[0][0]).toEqual(Buffer.from('test', 'ascii'))

			await dev.terminate()
		})

		test('Hex encoding', async () => {
			const dev = new TcpSendDevice(getDeviceContext())
			await dev.init({
				host: '192.168.0.254',
				port: 1234,
				bufferEncoding: 'hex',
			})
			await sleep(10)

			const content = literal<TimelineContentTCPSendAny>({
				...DEFAULT_TL_CONTENT,
				message: '48656c6c6f', // "Hello" in hex
			})
			const commands = dev.diffStates(
				createTimelineState({}),
				createTimelineState({
					layer0: { id: 'obj0', layer: 'layer0', content },
				})
			)

			await dev.sendCommand(commands[0])

			expect(onSocketWrite.mock.calls[0][0]).toEqual(Buffer.from('48656c6c6f', 'hex'))

			await dev.terminate()
		})
	})

	describe('Error handling', () => {
		test('Connection errors are reported', async () => {
			const device = await getInitializedTcpDevice()
			const errorHandler = jest.fn()
			device['context'].logger.error = errorHandler

			const sockets = SocketMock.openSockets()
			expect(sockets).toHaveLength(1)

			const error = new Error('Connection error') as NodeJS.ErrnoException
			error.code = 'ECONNRESET'

			sockets[0].emit('error', error)

			// Error should be logged
			expect(errorHandler).toHaveBeenCalledWith('TCP socket error', error)

			await device.terminate()
		})

		test('Socket close triggers reconnection', async () => {
			const device = await getInitializedTcpDevice()

			expect(device.connected).toBe(true)

			const sockets = SocketMock.openSockets()
			expect(sockets).toHaveLength(1)

			// Simulate that the socket is closed:
			sockets[0].mockClose()
			await sleep(10)

			// The device should have disconnected:
			expect(device.connected).toBe(false)

			// Wait for reconnect
			await sleep(600)

			// The device should have reconnected:
			expect(device.connected).toBe(true)

			await device.terminate()
		})
	})
})
function createTimelineState(
	objs: Record<string, { id: string; layer: string; content: TimelineContentTCPSendAny }>
): TcpSendDeviceState {
	return objs as any
}
const DEFAULT_TL_CONTENT: {
	deviceType: DeviceType.TCPSEND
} = {
	deviceType: DeviceType.TCPSEND,
}
