import {
	DeviceStatus,
	StatusCode,
	type VindralComposerOptions,
	type Mappings,
	type TSRTimelineContent,
	type SomeMappingVindralComposer,
	type VindralComposerDeviceTypes,
	type VindralComposerActionMethods,
} from 'timeline-state-resolver-types'
import { VindralComposer } from 'vindral-composer-connection'
import type { Device, DeviceContextAPI, DeviceTimelineState } from 'timeline-state-resolver-api'
import { buildVindralState, type VindralComposerDeviceState } from './stateBuilder.js'
import { diffVindralStates } from './diffState.js'
import { type VindralCommandWithContext, sendCommand } from './commands.js'
import { getActions } from './actions.js'

/**
 * This is a wrapper for the VindralComposer Device.
 */
export class VindralComposerDevice implements Device<
	VindralComposerDeviceTypes,
	VindralComposerDeviceState,
	VindralCommandWithContext
> {
	private _connection: VindralComposer | undefined
	private _connected = false

	readonly actions: VindralComposerActionMethods

	constructor(public readonly context: DeviceContextAPI<VindralComposerDeviceTypes, VindralComposerDeviceState>) {
		this.actions = getActions(() => this._connection)
	}

	async init(options: VindralComposerOptions): Promise<boolean> {
		this._connection = new VindralComposer({
			host: options.host,
			wsPort: options.wsPort,
			httpPort: options.httpPort,
			autoReconnect: options.autoReconnect,
		})

		this._connection.on('connected', () => {
			this._connected = true
			this._connectionChanged()
			this.context.resetState()
		})
		this._connection.on('disconnected', () => {
			this._connected = false
			this._connectionChanged()
		})
		this._connection.on('error', (msg) => this.context.logger.error('VindralComposer', new Error(msg)))
		this._connection.on('info', (msg) => this.context.logger.info(msg))

		this._connection.connect().catch((e) => this.context.logger.error('VindralComposer connect', e))
		return true
	}

	async terminate(): Promise<void> {
		const conn = this._connection
		this._connection = undefined
		conn?.removeAllListeners()
		conn?.on('error', () => undefined) // prevent unhandled error events during async disconnect
		conn?.disconnect()
	}

	get connected(): boolean {
		return this._connected
	}

	getStatus(): Omit<DeviceStatus, 'active'> {
		return this._connected
			? { statusCode: StatusCode.GOOD, messages: [] }
			: { statusCode: StatusCode.BAD, messages: ['VindralComposer disconnected'] }
	}

	convertTimelineStateToDeviceState(
		timelineState: DeviceTimelineState<TSRTimelineContent>,
		mappings: Mappings<SomeMappingVindralComposer>
	): VindralComposerDeviceState {
		return buildVindralState(timelineState, mappings)
	}

	diffStates(
		oldState: VindralComposerDeviceState | undefined,
		newState: VindralComposerDeviceState,
		mappings: Mappings<SomeMappingVindralComposer>,
		_time: number
	): VindralCommandWithContext[] {
		if (!this._connected) return []
		return diffVindralStates(oldState, newState, mappings)
	}

	async sendCommand(command: VindralCommandWithContext): Promise<void> {
		this.context.logger.debug(command)
		if (!this._connected || !this._connection) return
		try {
			await sendCommand(this._connection, command.command)
		} catch (error: unknown) {
			this.context.logger.error('VindralComposer', error as Error)
			this.context.commandError(error as Error, command)
		}
	}

	private _connectionChanged(): void {
		this.context.connectionChanged(this.getStatus())
	}
}
