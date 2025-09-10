import {
	DeviceStatus,
	StatusCode,
	KairosOptions,
	Mappings,
	Timeline,
	TSRTimelineContent,
	SomeMappingKairos,
	KairosDeviceTypes,
	KairosActionMethods,
	KairosActions,
} from 'timeline-state-resolver-types'
// eslint-disable-next-line node/no-missing-import
import { KairosConnection } from 'kairos-connection'
import type { Device, DeviceContextAPI, CommandWithContext } from 'timeline-state-resolver-api'
import { KairosDeviceState, KairosStateBuilder } from './stateBuilder'
import { diffKairosStates } from './diffState'
import { sendCommand, type KairosCommandAny } from './commands'

export type KairosCommandWithContext = CommandWithContext<KairosCommandAny, string>

/**
 * This is a wrapper for the Kairos Device. Commands to any and all kairos devices will be sent through here.
 */
export class KairosDevice implements Device<KairosDeviceTypes, KairosDeviceState, KairosCommandWithContext> {
	readonly actions: KairosActionMethods = {
		[KairosActions.ListClips]: async () => {
			throw new Error('Not implemented')
		},
		[KairosActions.ListStills]: async () => {
			throw new Error('Not implemented')
		},
		[KairosActions.PlayMacro]: async () => {
			throw new Error('Not implemented')
		},
	}

	private readonly _kairos = new KairosConnection()

	constructor(protected context: DeviceContextAPI<KairosDeviceState>) {
		// Nothing
	}

	/**
	 * Initiates the connection with the KAIROS through the kairos-connection lib
	 * and initiates Kairos State lib.
	 */
	async init(options: KairosOptions): Promise<boolean> {
		this._kairos.on('disconnect', () => {
			this._connectionChanged()
		})
		this._kairos.on('error', (e) => this.context.logger.error('Kairos', e))
		this._kairos.on('warn', (e) => this.context.logger.warning(`Kairos: ${e?.message ?? e}`))
		// this._kairos.on('stateChanged', (state) => {
		// 	// the external device is communicating something changed, the tracker should be updated (and may fire a "blocked" event if the change is caused by someone else)
		// 	updateFromKairosState((addr, addrState) => this.context.setAddressState(addr, addrState), state) // note - improvement can be to update depending on the actual paths that changed

		// 	// old stuff for connection statuses/events:
		// 	this._onKairosStateChanged(state)
		// })

		this._kairos.on('reset', () => {
			this.context.resetResolver()
			this._connectionChanged()
		})

		this._kairos.on('connect', () => {
			this._connectionChanged()

			// if (this._kairos.state) {
			// 	// Do a state diff to get to the desired state
			// 	this._protocolVersion = this._kairos.state.info.apiVersion
			// 	this.context
			// 		.resetToState(this._kairos.state)
			// 		.catch((e) => this.context.logger.error('Error resetting kairos state', new Error(e)))
			// } else {
			// 	// Do a state diff to at least send all the commands we know about
			this.context.resetState().catch((e) => this.context.logger.error('Error resetting kairos state', new Error(e)))
			// }
		})

		// Start the connection, without waiting
		this._kairos.connect(options.host, options.port)

		return true
	}
	/**
	 * Safely terminate everything to do with this device such that it can be
	 * garbage collected.
	 */
	async terminate(): Promise<void> {
		this._kairos.disconnect()
		this._kairos.discard()
		this._kairos.removeAllListeners()
	}

	// private async resyncState(): Promise<ActionExecutionResult> {
	// 	this.context.resetResolver()

	// 	return {
	// 		result: ActionExecutionResultCode.Ok,
	// 	}
	// }

	get connected(): boolean {
		return this._kairos.connected
	}

	/**
	 * Convert a timeline state into an Kairos state.
	 * @param timelineState The state to be converted
	 */
	convertTimelineStateToDeviceState(
		timelineState: Timeline.TimelineState<TSRTimelineContent>,
		mappings: Mappings
	): KairosDeviceState {
		const deviceState = KairosStateBuilder.fromTimeline(timelineState.layers, mappings)

		return deviceState
	}

	/**
	 * Check status and return it with useful messages appended.
	 */
	public getStatus(): Omit<DeviceStatus, 'active'> {
		if (!this.connected) {
			return {
				statusCode: StatusCode.BAD,
				messages: [`Kairos disconnected`],
			}
		} else {
			return {
				statusCode: StatusCode.GOOD,
				messages: [],
			}
		}
	}

	/**
	 * Compares the new timeline-state with the old one, and generates commands to account for the difference
	 * @param oldKairosState
	 * @param newKairosState
	 */
	diffStates(
		oldKairosState: KairosDeviceState | undefined,
		newKairosState: KairosDeviceState,
		mappings: Mappings<SomeMappingKairos>
	): Array<KairosCommandWithContext> {
		// Skip diffing if not connected, a resolverReset will be fired upon reconnection
		if (!this.connected) return []

		return diffKairosStates(oldKairosState, newKairosState, mappings)
	}

	async sendCommand(command: KairosCommandWithContext): Promise<void> {
		this.context.logger.debug(command)

		// Skip attempting send if not connected
		if (!this.connected) return

		try {
			await sendCommand(this._kairos, command.command)
		} catch (error: any) {
			this.context.commandError(error, command)
		}
	}

	// applyAddressState(state: DeviceState, _address: string, addressState: AnyAddressState): void {
	// 	applyAddressStateToKairosState(state, addressState)
	// }
	// diffAddressStates(state1: AnyAddressState, state2: AnyAddressState): boolean {
	// 	return diffAddressStates(state1, state2)
	// }
	// addressStateReassertsControl(oldState: AnyAddressState | undefined, newState: AnyAddressState): boolean {
	// 	return oldState?.controlValue !== newState.controlValue
	// }

	private _connectionChanged() {
		this.context.connectionChanged(this.getStatus())
	}
}
