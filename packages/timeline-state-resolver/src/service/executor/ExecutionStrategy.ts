import { CommandWithContext } from 'timeline-state-resolver-api'
import { Measurement } from '../measure.js'

/**
 * Defines how a batch of commands is dispatched to the device.
 */
export interface ExecutionStrategy<Command extends CommandWithContext<unknown, unknown>> {
	/**
	 * Executes the given commands according to the strategy's ordering rules.
	 *
	 * @param totalTime - The maximum preliminary offset (ms) among all commands in the
	 *   batch. Commands use this to calculate how long to wait before being sent.
	 * @param commands - The commands to execute, pre-sorted by descending preliminary value.
	 * @param measurement - Optional measurement tracker for profiling command execution.
	 */
	execute(totalTime: number, commands: Command[], measurement?: Measurement): Promise<void>
}
