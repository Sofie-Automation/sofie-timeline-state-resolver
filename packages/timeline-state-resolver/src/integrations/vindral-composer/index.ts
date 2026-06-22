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
import {
	VindralComposer,
	type VindralComposerOptions as VindralComposerConnectionOptions,
} from 'vindral-composer-connection'
import type { Device, DeviceContextAPI, DeviceTimelineState } from 'timeline-state-resolver-api'
import { isEqual } from 'underscore'
import { buildVindralState, type VindralComposerDeviceState } from './stateBuilder.js'
import { diffVindralStates, getDisabledScriptEngineWarnings } from './diffState.js'
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
	/** When true, supported operations are routed through tsr* Script Engine helper functions. */
	private _useScriptEngine = false
	/** Warnings about desired-state features that cannot be applied (e.g. Script Engine disabled). */
	private _stateWarnings: string[] = []

	readonly actions: VindralComposerActionMethods

	constructor(public readonly context: DeviceContextAPI<VindralComposerDeviceTypes, VindralComposerDeviceState>) {
		this.actions = getActions(() => this._connection)
	}

	async init(options: VindralComposerOptions): Promise<boolean> {
		// Only pass defined values so the library's built-in defaults are not overridden by undefined
		const connOptions: VindralComposerConnectionOptions = {}
		if (options.host !== undefined) connOptions.host = options.host
		if (options.wsPort !== undefined) connOptions.wsPort = options.wsPort
		if (options.httpPort !== undefined) connOptions.httpPort = options.httpPort
		if (options.autoReconnect !== undefined) connOptions.autoReconnect = options.autoReconnect
		this._useScriptEngine = options.useScriptEngine ?? false
		this._connection = new VindralComposer(connOptions)

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
		if (!this._connected) {
			return { statusCode: StatusCode.BAD, messages: ['VindralComposer disconnected'] }
		}
		if (this._stateWarnings.length > 0) {
			return { statusCode: StatusCode.WARNING_MAJOR, messages: this._stateWarnings }
		}
		return { statusCode: StatusCode.GOOD, messages: [] }
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

		// Single source of truth for "features the disabled Script Engine flow cannot honour":
		// getDisabledScriptEngineWarnings. Drive both the per-change log lines (gated on newly-appeared
		// warnings to avoid spam) and the persistent device status from it, so a future Script Engine
		// feature only has to be added to the detector to get both behaviours.
		const warnings = this._useScriptEngine ? [] : getDisabledScriptEngineWarnings(newState)
		const previousWarnings = this._useScriptEngine || !oldState ? [] : getDisabledScriptEngineWarnings(oldState)
		for (const warning of warnings) {
			if (!previousWarnings.includes(warning)) this.context.logger.warning(warning)
		}
		if (!isEqual(warnings, this._stateWarnings)) {
			this._stateWarnings = warnings
			this._connectionChanged()
		}

		return diffVindralStates(oldState, newState, mappings, this._useScriptEngine)
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
