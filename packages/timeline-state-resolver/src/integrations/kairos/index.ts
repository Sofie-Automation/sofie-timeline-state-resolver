import {
	DeviceStatus,
	StatusCode,
	KairosOptions,
	Mappings,
	TSRTimelineContent,
	SomeMappingKairos,
	KairosDeviceTypes,
	KairosActionMethods,
} from 'timeline-state-resolver-types'
// eslint-disable-next-line node/no-missing-import
import { KairosConnection } from 'kairos-connection'
import type { Device, DeviceContextAPI, CommandWithContext, DeviceTimelineState } from 'timeline-state-resolver-api'
import { KairosDeviceState, KairosStateBuilder } from './stateBuilder'
import { diffKairosStates } from './diffState'
import { sendCommand, type KairosCommandAny } from './commands'
import { getActions } from './actions'
import { KairosRamLoader } from './lib/kairosRamLoader'
import { KairosApplicationMonitor } from './kairos-application-monitor'

export type KairosCommandWithContext = CommandWithContext<KairosCommandAny, string>

/**
 * This is a wrapper for the Kairos Device. Commands to any and all kairos devices will be sent through here.
 */
export class KairosDevice implements Device<KairosDeviceTypes, KairosDeviceState, KairosCommandWithContext> {
	private readonly _kairos: KairosConnection
	private readonly _kairosRamLoader: KairosRamLoader
	private readonly _kairosApplicationMonitor: KairosApplicationMonitor

	readonly actions: KairosActionMethods
	/** Whether to monitor the Kairos application state (check that all resources exist etc) */
	private _monitorState: boolean | undefined

	constructor(public context: DeviceContextAPI<KairosDeviceState>) {
		this._kairos = new KairosConnection()
		this._kairosRamLoader = new KairosRamLoader(this._kairos, context)
		this._kairosApplicationMonitor = new KairosApplicationMonitor(this._kairos)
		this.actions = getActions(this._kairos)

		this._kairosApplicationMonitor.on('error', (e: Error) =>
			this.context.logger.error('Error from Kairos Application Checker', e)
		)
		this._kairosApplicationMonitor.on('status', () => this._connectionChanged())
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

		this._monitorState = options.monitorState

		// Start the connection, without waiting
		this._kairos.connect(options.host, options.port)

		return true
	}
	/**
	 * Safely terminate everything to do with this device such that it can be
	 * garbage collected.
	 */
	async terminate(): Promise<void> {
		this._kairosApplicationMonitor.terminate()
		this._kairos.disconnect()
		this._kairos.discard()
		this._kairos.removeAllListeners()
	}

	get connected(): boolean {
		return this._kairos.connected
	}

	/**
	 * Convert a timeline state into an Kairos state.
	 * @param timelineState The state to be converted
	 */
	convertTimelineStateToDeviceState(
		timelineState: DeviceTimelineState<TSRTimelineContent>,
		mappings: Mappings<SomeMappingKairos>
	): KairosDeviceState {
		const deviceState = KairosStateBuilder.fromTimeline(timelineState, mappings)

		// Note: Nut sure if this is the best way to handle this, perhaps we should
		// have a way to store the mappings somewhere else?
		this._kairosApplicationMonitor.updateMappings(mappings)
		this._kairosApplicationMonitor.updateDeviceState(deviceState)

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
		}
		if (this._monitorState) {
			if (this._kairosApplicationMonitor.status.statusCode !== StatusCode.GOOD) {
				return this._kairosApplicationMonitor.status
			}
		}
		return {
			statusCode: StatusCode.GOOD,
			messages: [],
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
			await sendCommand(this._kairos, this._kairosRamLoader, command.command)
		} catch (error: any) {
			this.context.commandError(error, command)
		}
	}

	private _connectionChanged() {
		this.context.connectionChanged(this.getStatus())
	}
}
