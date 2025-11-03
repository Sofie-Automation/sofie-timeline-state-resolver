import {
	DeviceStatus,
	StatusCode,
	KairosOptions,
	Mappings,
	TSRTimelineContent,
	SomeMappingKairos,
	Timeline,
	ActionExecutionResult,
} from 'timeline-state-resolver-types'
// eslint-disable-next-line node/no-missing-import
import { KairosConnection } from 'kairos-connection'
import { KairosDeviceState, KairosStateBuilder } from './stateBuilder'
import { diffKairosStates } from './diffState'
import { sendCommand, type KairosCommandAny } from './commands'
import { getActions } from './actions'
import { CommandWithContext, Device, DeviceContextAPI } from '../../service/device'

export interface KairosCommandWithContext extends CommandWithContext {
	command: KairosCommandAny
	context: string
}

/**
 * This is a wrapper for the Kairos Device. Commands to any and all kairos devices will be sent through here.
 */
export class KairosDevice extends Device<KairosOptions, KairosDeviceState, KairosCommandWithContext> {
	private readonly _kairos: KairosConnection
	readonly actions: Record<string, (id: string, payload?: Record<string, any>) => Promise<ActionExecutionResult>>

	constructor(context: DeviceContextAPI<KairosDeviceState>) {
		super(context)

		this._kairos = new KairosConnection()
		this.actions = getActions(this._kairos) as any // Type safety is hard in the r52 api..
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

		this._kairos.on('reset', () => {
			this.context.resetResolver()
			this._connectionChanged()
		})

		this._kairos.on('connect', () => {
			this._connectionChanged()

			// Do a state diff to at least send all the commands we know about
			this.context.resetState().catch((e) => this.context.logger.error('Error resetting kairos state', new Error(e)))
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

	get connected(): boolean {
		return this._kairos.connected
	}

	async makeReady(): Promise<void> {
		// No-op
	}
	async standDown(): Promise<void> {
		// No-op
	}

	/**
	 * Convert a timeline state into an Kairos state.
	 * @param timelineState The state to be converted
	 */
	convertTimelineStateToDeviceState(
		timelineState: Timeline.TimelineState<TSRTimelineContent>,
		mappings: Mappings
	): KairosDeviceState {
		const deviceState = KairosStateBuilder.fromTimeline(timelineState, mappings)

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

	private _connectionChanged() {
		this.context.connectionChanged(this.getStatus())
	}
}
