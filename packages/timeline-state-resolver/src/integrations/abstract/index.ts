import {
	AbstractOptions,
	TSRTimelineContent,
	AbstractActionMethods,
	ActionExecutionResultCode,
	AbstractDeviceTypes,
	AbstractActions,
	StatusCode,
	DeviceStatus,
} from 'timeline-state-resolver-types'
import type {
	Device,
	CommandWithContext,
	DeviceContextAPI,
	DeviceTimelineState,
	DeviceTimelineStateObject,
} from 'timeline-state-resolver-api'

export type AbstractCommandWithContext = CommandWithContext<string, string>

export type AbstractDeviceState = Record<string, DeviceTimelineStateObject<TSRTimelineContent>>

/*
	This is a wrapper for an "Abstract" device

	An abstract device is just a test-device that doesn't really do anything, but can be used
	as a preliminary mock
*/
export class AbstractDevice implements Device<AbstractDeviceTypes, AbstractDeviceState, AbstractCommandWithContext> {
	readonly actions: AbstractActionMethods = {
		[AbstractActions.TestAction]: async () => {
			// noop
			return { result: ActionExecutionResultCode.Ok }
		},
	}

	public readonly connected = false

	constructor(protected context: DeviceContextAPI<AbstractDeviceState>) {
		// Nothing
	}

	/**
	 * Initiates the connection with CasparCG through the ccg-connection lib.
	 */
	async init(_initOptions: AbstractOptions): Promise<boolean> {
		// This is where we would do initialization, but not connecting to the device
		return true
	}

	/**
	 * Dispose of the device so it can be garbage collected.
	 */
	async terminate(): Promise<void> {
		// Noop
	}

	/**
	 * converts the timeline state into something we can use
	 * @param state
	 */
	convertTimelineStateToDeviceState(state: DeviceTimelineState<TSRTimelineContent>) {
		return state.objects.reduce((acc, obj) => {
			acc[obj.layer] = obj
			return acc
		}, {} as AbstractDeviceState)
	}

	getStatus(): Omit<DeviceStatus, 'active'> {
		return {
			statusCode: StatusCode.GOOD,
			messages: [],
		}
	}

	/**
	 * Compares the new timeline-state with the old one, and generates commands to account for the difference
	 * @param oldAbstractState
	 * @param newAbstractState
	 */
	diffStates(oldAbstractState: AbstractDeviceState | undefined, newAbstractState: AbstractDeviceState) {
		// in this abstract class, let's just cheat:

		const commands: Array<AbstractCommandWithContext> = []

		for (const [layerKey, newLayer] of Object.entries<DeviceTimelineStateObject<any>>(newAbstractState)) {
			const oldLayer = oldAbstractState?.[layerKey]
			if (!oldLayer) {
				// added!
				commands.push({
					command: 'addedAbstract',
					timelineObjId: newLayer.id,
					context: `added: ${newLayer.id}`,
				})
			} else {
				// changed?
				if (oldLayer.id !== newLayer.id) {
					// changed!
					commands.push({
						command: 'changedAbstract',
						timelineObjId: newLayer.id,
						context: `changed: ${newLayer.id}`,
					})
				}
			}
		}

		// removed
		for (const [layerKey, oldLayer] of Object.entries<DeviceTimelineStateObject<any>>(oldAbstractState || {})) {
			const newLayer = newAbstractState[layerKey]
			if (!newLayer) {
				// removed!
				commands.push({
					command: 'removedAbstract',
					timelineObjId: oldLayer.id,
					context: `removed: ${oldLayer.id}`,
				})
			}
		}

		return commands
	}

	async sendCommand({ command, context, timelineObjId }: AbstractCommandWithContext): Promise<any> {
		// emit the command to debug:
		this.context.logger.debug({ command, context, timelineObjId })

		// Note: In the Abstract case, the execution does nothing

		return null
	}
}
