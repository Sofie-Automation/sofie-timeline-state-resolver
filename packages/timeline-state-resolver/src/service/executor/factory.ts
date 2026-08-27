import { ExecutionStrategy } from './ExecutionStrategy.js'
import { StateHandlerContext } from '../stateHandler.js'
import { PersistentCommandQueue } from './PersistentCommandQueue.js'
import { SalvoStrategy } from './SalvoStrategy.js'
import { SequentialPersistentStrategy } from './SequentialPersistentStrategy.js'
import { SequentialStrategy } from './SequentialStrategy.js'
import type { BaseDeviceAPI, CommandWithContext } from 'timeline-state-resolver-api'

export function createExecutionStrategy<DeviceState, Command extends CommandWithContext<unknown, unknown>>(
	logger: StateHandlerContext['logger'],
	mode: 'salvo' | 'sequential' | 'sequential-persistent',
	sendCommand: BaseDeviceAPI<DeviceState, void, Command>['sendCommand']
): ExecutionStrategy<Command> {
	if (mode === 'salvo') return new SalvoStrategy(logger, sendCommand)
	if (mode === 'sequential-persistent')
		return new SequentialPersistentStrategy(logger, sendCommand, new PersistentCommandQueue())
	return new SequentialStrategy(logger, sendCommand)
}
