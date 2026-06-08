import { ExecutionStrategy } from './ExecutionStrategy.js'
import { Measurement } from '../measure.js'
import { sleep } from './helpers.js'
import { BaseDeviceAPI, CommandWithContext } from 'timeline-state-resolver-api'
import { StateHandlerContext } from '../stateHandler.js'

export class SalvoStrategy<
	DeviceState,
	Command extends CommandWithContext<unknown, unknown>,
> implements ExecutionStrategy<Command> {
	constructor(
		private logger: StateHandlerContext['logger'],
		private sendCommand: BaseDeviceAPI<DeviceState, void, Command>['sendCommand']
	) {}

	async execute(totalTime: number, commands: Command[], measurement?: Measurement): Promise<void> {
		const start = Date.now()
		await Promise.allSettled(
			commands.map(async (command) => {
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
			})
		)
	}
}
