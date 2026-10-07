import type { CommandWithContext } from 'timeline-state-resolver-api'
import { Measurement } from './measure.js'
import { ExecutionStrategy } from './executor/ExecutionStrategy.js'

export class CommandExecutor<Command extends CommandWithContext<unknown, unknown>> {
	constructor(private strategy: ExecutionStrategy<Command>) {}

	async executeCommands(commands: Command[], measurement?: Measurement): Promise<void> {
		if (commands.length === 0) return

		// Sort the commands, so that the ones with the highest preliminary time are executed first.
		commands.sort((a, b) => (b.preliminary ?? 0) - (a.preliminary ?? 0))

		const totalTime = commands[0].preliminary ?? 0

		return this.strategy.execute(totalTime, commands, measurement)
	}
}
