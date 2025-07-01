import * as _ from 'underscore'
import { BaseDeviceAPI, CommandWithContext } from './device'
import { Measurement } from './measure'
import { StateHandlerContext } from './stateHandler'

export class CommandExecutor<DeviceState, Command extends CommandWithContext> {
	constructor(
		private logger: StateHandlerContext['logger'],
		private mode: 'salvo' | 'sequential',
		private sendCommand: BaseDeviceAPI<DeviceState, Command>['sendCommand']
	) {}

	async executeCommands(commands: Command[], measurement?: Measurement): Promise<void> {
		if (commands.length === 0) return

		// Sort the commands, so that the ones with the highest preliminary time are executed first.
		commands.sort((a, b) => (b.preliminary ?? 0) - (a.preliminary ?? 0))

		const totalTime = commands[0].preliminary ?? 0

		if (this.mode === 'salvo') {
			return this._executeCommandsSalvo(totalTime, commands, measurement)
		} else {
			return this._executeCommandsSequential(totalTime, commands, measurement)
		}
	}

	private async _executeCommandsSalvo(
		totalTime: number,
		commands: Command[],
		measurement?: Measurement
	): Promise<void> {
		const start = Date.now() // note - would be better to use monotonic time here but BigInt's are annoying

		await Promise.allSettled(
			commands.map(async (command) => {
				const targetTime = start + totalTime - (command.preliminary ?? 0)

				const timeToWait = targetTime - Date.now()
				if (timeToWait > 0) {
					await sleep(timeToWait)
				}

				measurement?.executeCommand(command)
				let result: unknown
				try {
					result = await this.sendCommand(command)
				} catch (e) {
					this.logger.error('Error while executing command', e as any)
				} finally {
					measurement?.finishedCommandExecution(command)
				}
				return result
			})
		)
	}

	private async _executeCommandsSequential(
		totalTime: number,
		commands: Command[],
		measurement?: Measurement
	): Promise<void> {
		const start = Date.now() // note - would be better to use monotonic time here but BigInt's are annoying

		const commandQueues = _.groupBy(commands || [], (command) => command.queueId ?? '$$default')

		await Promise.allSettled(
			Object.values<Command[]>(commandQueues).map(async (commandsInQueue): Promise<void> => {
				try {
					for (const command of commandsInQueue) {
						const targetTime = start + totalTime - (command.preliminary ?? 0)

						const timeToWait = targetTime - Date.now()
						if (timeToWait > 0) {
							await sleep(timeToWait)
						}

						measurement?.executeCommand(command)
						try {
							await this.sendCommand(command)
						} catch (e) {
							this.logger.error('Error while executing command', e as any)
						} finally {
							measurement?.finishedCommandExecution(command)
						}
					}
				} catch (e) {
					this.logger.error('CommandExecutor', new Error('Error in _executeCommandsSequential'))
				}
			})
		)
	}
}
async function sleep(duration: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, duration))
}
