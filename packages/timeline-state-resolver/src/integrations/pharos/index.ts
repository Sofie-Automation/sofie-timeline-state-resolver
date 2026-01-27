import {
	PharosOptions,
	Mappings,
	TSRTimelineContent,
	DeviceStatus,
	StatusCode,
	PharosDeviceTypes,
	PharosError,
	PharosErrorCode,
	PharosErrorMessages,
} from 'timeline-state-resolver-types'
import { Pharos } from './connection.js'
import type {
	Device,
	CommandWithContext,
	DeviceContextAPI,
	DeviceTimelineState,
	DeviceTimelineStateObject,
} from 'timeline-state-resolver-api'
import { diffStates } from './diffStates.js'
import { createPharosError } from './errors.js'
import { errorsToMessages } from '../../deviceErrorMessages.js'

export type PharosCommandWithContext = CommandWithContext<CommandContent, string>
export type PharosState = Record<string, DeviceTimelineStateObject<TSRTimelineContent>>

interface CommandContent {
	fcn: (pharos: Pharos) => Promise<unknown>
}

/**
 * This is a wrapper for a Pharos-devices,
 * https://www.pharoscontrols.com/downloads/documentation/application-notes/
 */
export class PharosDevice implements Device<PharosDeviceTypes, PharosState, PharosCommandWithContext> {
	readonly actions = null

	private _pharos: Pharos

	constructor(protected context: DeviceContextAPI<PharosState>) {
		this._pharos = new Pharos()
		this._pharos.on('error', (e) => this.context.logger.error('Pharos', e))
		this._pharos.on('connected', () => {
			this._connectionChanged()
		})
		this._pharos.on('disconnected', () => {
			this._connectionChanged()
		})
	}

	/**
	 * Initiates the connection with Pharos through the PharosAPI.
	 */
	async init(initOptions: PharosOptions): Promise<boolean> {
		// This is where we would do initialization, like connecting to the devices, etc
		this._pharos
			.connect(initOptions)
			.then(() => {
				this._pharos
					.getProjectInfo()
					.then((info) => {
						this.context.logger.info(`Current project: ${info.name}`)
						this.context.resetToState({})
					})
					.catch((e) => this.context.logger.error('Failed to query project', e))
			})
			.catch((e) => this.context.logger.error('Failed to connect', e))

		return true
	}

	async terminate() {
		await this._pharos.dispose()
	}

	get connected(): boolean {
		return this._pharos.connected
	}

	convertTimelineStateToDeviceState(
		timelineState: DeviceTimelineState<TSRTimelineContent>,
		_mappings: Mappings
	): PharosState {
		return timelineState.objects.reduce((acc, obj) => {
			if (obj.layer) acc[obj.layer] = obj
			return acc
		}, {} as PharosState)
	}

	getStatus(): Omit<DeviceStatus, 'active'> {
		let statusCode = StatusCode.GOOD
		const errors: PharosError[] = []

		if (!this._pharos.connected) {
			statusCode = StatusCode.BAD
			errors.push(createPharosError(PharosErrorCode.NOT_CONNECTED, {}))
		}

		return {
			statusCode: statusCode,
			messages: errorsToMessages(errors, PharosErrorMessages),
			errors,
		}
	}

	/**
	 * Compares the new timeline-state with the old one, and generates commands to account for the difference
	 * @param oldAtemState
	 * @param newAtemState
	 */
	diffStates(
		oldPharosState: PharosState | undefined,
		newPharosState: PharosState,
		mappings: Mappings
	): Array<PharosCommandWithContext> {
		return diffStates(oldPharosState, newPharosState, mappings)
	}

	async sendCommand(cwc: PharosCommandWithContext): Promise<void> {
		this.context.logger.debug(cwc)

		// Skip attempting send if not connected
		if (!this.connected) return

		try {
			await cwc.command.fcn(this._pharos)
		} catch (error: any) {
			this.context.commandError(error, cwc)
		}
	}

	private _connectionChanged() {
		this.context.connectionChanged(this.getStatus())
	}
}
