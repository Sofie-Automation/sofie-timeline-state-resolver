import { waitTime } from '../../__tests__/lib.js'
import { CommandExecutor } from '../commandExecutor.js'

describe('CommandExecutor', () => {
	const FUDGE_TIME = 50 // ms
	const logger = {
		info: jest.fn(console.log),
		warn: jest.fn(console.warn),
		error: jest.fn(console.warn),
		debug: jest.fn(console.log),
	}
	let startTime = Date.now()
	let timeToExecuteCommand = 0
	let receivedCommandTimes: { [cmd: string]: number } = {}
	const sendCommand = jest.fn(async (cmd) => {
		receivedCommandTimes[cmd.command] = Date.now() - startTime
		if (timeToExecuteCommand > 0) await waitTime(timeToExecuteCommand)
	})

	beforeEach(() => {
		receivedCommandTimes = {}
		timeToExecuteCommand = 0
		sendCommand.mockClear()
	})
	test('salvo commands', async () => {
		timeToExecuteCommand = 100 // ms
		const commandExecutor = new CommandExecutor(logger, 'salvo', sendCommand)

		startTime = Date.now()
		await commandExecutor.executeCommands([
			{ command: 'A0' },
			{ command: 'A1' },
			{ command: 'A2' },
			{ command: 'A3' },
			{ command: 'A4' },
		])

		expect(sendCommand).toHaveBeenCalledTimes(5)
		expect(Math.abs(receivedCommandTimes['A0'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A1'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A2'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A3'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A4'] - 0)).toBeLessThan(FUDGE_TIME)
	})
	test('salvo commands, with preliminary', async () => {
		timeToExecuteCommand = 100 // ms
		const commandExecutor = new CommandExecutor(logger, 'salvo', sendCommand)

		startTime = Date.now()
		await commandExecutor.executeCommands([
			{ command: 'A0' },
			{ command: 'A1' },
			{ command: 'A-p200', preliminary: 200 },
			{ command: 'A-p500', preliminary: 500 },
		])

		expect(sendCommand).toHaveBeenCalledTimes(4)
		expect(Math.abs(receivedCommandTimes['A-p500'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A-p200'] - 300)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A0'] - 500)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A1'] - 500)).toBeLessThan(FUDGE_TIME)
	})
	test('sequential commands', async () => {
		timeToExecuteCommand = 100 // ms
		const commandExecutor = new CommandExecutor(logger, 'sequential', sendCommand)

		startTime = Date.now()
		await commandExecutor.executeCommands([
			{ command: 'A0' },
			{ command: 'A1' },
			{ command: 'A2' },
			{ command: 'A3' },
			{ command: 'A4' },
		])

		expect(sendCommand).toHaveBeenCalledTimes(5)
		expect(Math.abs(receivedCommandTimes['A0'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A1'] - 100)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A2'] - 200)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A3'] - 300)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A4'] - 400)).toBeLessThan(FUDGE_TIME)
	})
	test('sequential commands, multiple queues', async () => {
		timeToExecuteCommand = 100 // ms
		const commandExecutor = new CommandExecutor(logger, 'sequential', sendCommand)

		startTime = Date.now()
		await commandExecutor.executeCommands([
			{ command: 'A0', queueId: 'queueA' },
			{ command: 'A1', queueId: 'queueA' },
			{ command: 'A2', queueId: 'queueA' },
			{ command: 'A3', queueId: 'queueA' },
			{ command: 'A4', queueId: 'queueA' },
			{ command: 'B0', queueId: 'queueB' },
			{ command: 'B1', queueId: 'queueB' },
			{ command: 'B2', queueId: 'queueB' },
			{ command: 'B3', queueId: 'queueB' },
			{ command: 'B4', queueId: 'queueB' },
		])

		expect(sendCommand).toHaveBeenCalledTimes(10)
		expect(Math.abs(receivedCommandTimes['A0'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A1'] - 100)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A2'] - 200)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A3'] - 300)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A4'] - 400)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['B0'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['B1'] - 100)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['B2'] - 200)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['B3'] - 300)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['B4'] - 400)).toBeLessThan(FUDGE_TIME)
	})
	test('sequential commands, with preliminary', async () => {
		timeToExecuteCommand = 100 // ms
		const commandExecutor = new CommandExecutor(logger, 'sequential', sendCommand)

		startTime = Date.now()
		await commandExecutor.executeCommands([
			{ command: 'A0' },
			{ command: 'A1' },
			{ command: 'A2' },
			{ command: 'A3' },
			{ command: 'Ap100', preliminary: 200 },
			{ command: 'Ap200', preliminary: 300 },
		])

		expect(sendCommand).toHaveBeenCalledTimes(6)
		expect(Math.abs(receivedCommandTimes['Ap200'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['Ap100'] - 100)).toBeLessThan(FUDGE_TIME)
		// The rest are delayed:
		expect(Math.abs(receivedCommandTimes['A0'] - 300)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A1'] - 400)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A2'] - 500)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A3'] - 600)).toBeLessThan(FUDGE_TIME)
	})
	test('sequential with preliminary, in multiple queues', async () => {
		const commandExecutor = new CommandExecutor(logger, 'sequential', sendCommand)

		startTime = Date.now()
		await commandExecutor.executeCommands([
			// Commands are 2 queues, A and B
			// in random order, with preliminary times
			{
				command: 'A-0',
				queueId: 'queueA',
			},
			{
				command: 'A-300',
				queueId: 'queueA',
				preliminary: 300,
			},
			{
				command: 'B-300',
				queueId: 'queueB',
				preliminary: 300,
			},
			{
				command: 'A-1000',
				queueId: 'queueA',
				preliminary: 1000,
			},
			{
				command: 'B-1000',
				queueId: 'queueB',
				preliminary: 1000,
			},
			{
				command: 'B-500',
				queueId: 'queueB',
				preliminary: 500,
			},
			{
				command: 'A-500',
				queueId: 'queueA',
				preliminary: 500,
			},
			{
				command: 'B-0',
				queueId: 'queueB',
			},
		])

		expect(sendCommand).toHaveBeenCalledTimes(8)
		expect(Math.abs(receivedCommandTimes['A-1000'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['B-1000'] - 0)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['B-500'] - 500)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A-500'] - 500)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A-300'] - 700)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['B-300'] - 700)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['A-0'] - 1000)).toBeLessThan(FUDGE_TIME)
		expect(Math.abs(receivedCommandTimes['B-0'] - 1000)).toBeLessThan(FUDGE_TIME)
	})
})
