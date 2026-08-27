import _ from 'underscore'
import { sleep } from './helpers.js'
import { ExecutionStrategy } from './ExecutionStrategy.js'
import { BaseDeviceAPI, CommandWithContext } from 'timeline-state-resolver-api'
import { Measurement } from '../measure.js'
import { StateHandlerContext } from '../stateHandler.js'
import { PersistentCommandQueue } from './PersistentCommandQueue.js'

/**
 * Like SequentialStrategy, but queue chains persist across state-change batches via a
 * PersistentCommandQueue, so commands with the same queueId from consecutive states are
 * never interleaved.
 */
export class SequentialPersistentStrategy<
	DeviceState,
	Command extends CommandWithContext<unknown, unknown>,
> implements ExecutionStrategy<Command> {
	constructor(
		private logger: StateHandlerContext['logger'],
		private sendCommand: BaseDeviceAPI<DeviceState, void, Command>['sendCommand'],
		private persistentQueue: PersistentCommandQueue
	) {}

	async execute(totalTime: number, commands: Command[], measurement?: Measurement): Promise<void> {
		const start = Date.now()
		const commandQueues = _.groupBy(commands || [], (command) => command.queueId ?? '$$default')

		await Promise.allSettled(
			Object.entries<Command[]>(commandQueues).map(async ([queueId, commandsInQueue]) =>
				this.persistentQueue.enqueue(queueId, async () => {
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
		)
	}
}
