import _ from 'underscore'
import { ExecutionStrategy } from './ExecutionStrategy.js'
import { Measurement } from '../measure.js'
import { StateHandlerContext } from '../stateHandler.js'
import { sleep } from './helpers.js'
import { BaseDeviceAPI, CommandWithContext } from 'timeline-state-resolver-api'

export class SequentialStrategy<
	DeviceState,
	Command extends CommandWithContext<unknown, unknown>,
> implements ExecutionStrategy<Command> {
	constructor(
		private logger: StateHandlerContext['logger'],
		private sendCommand: BaseDeviceAPI<DeviceState, void, Command>['sendCommand']
	) {}

	async execute(totalTime: number, commands: Command[], measurement?: Measurement): Promise<void> {
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
				} catch (_e) {
					this.logger.error('CommandExecutor', new Error('Error in _executeCommandsSequential'))
				}
			})
		)
	}
}
