import {
	DeviceStatus,
	statusDetailsToMessages,
	Mappings,
	ObsOptions,
	ObsDeviceTypes,
	StatusCode,
	TSRTimelineContent,
	OBSStatusCode,
	OBSStatusMessages,
} from 'timeline-state-resolver-types'
import type { Device, CommandWithContext, DeviceContextAPI, DeviceTimelineState } from 'timeline-state-resolver-api'
import { OBSDeviceState, convertStateToOBS, getDefaultState } from './state.js'
import { OBSRequestTypes } from 'obs-websocket-js'
import { diffStates } from './diff.js'
import { OBSConnection, OBSConnectionEvents } from './connection.js'
import { createOBSStatusDetail } from './errors.js'

export type OBSCommandWithContext = OBSCommandWithContextTyped<keyof OBSRequestTypes>
export type OBSCommandWithContextTyped<Type extends keyof OBSRequestTypes> = CommandWithContext<
	{
		requestName: Type
		args?: OBSRequestTypes[Type]
	},
	string
>

export class OBSDevice implements Device<ObsDeviceTypes, OBSDeviceState, OBSCommandWithContext> {
	private _options: ObsOptions | undefined = undefined
	private _obs: OBSConnection | undefined = undefined

	constructor(protected context: DeviceContextAPI<OBSDeviceState>) {
		// Nothing
	}

	async init(options: ObsOptions): Promise<boolean> {
		this._options = options
		this._obs = new OBSConnection()
		this._obs.on(OBSConnectionEvents.Connected, () => {
			this.context.logger.debug('OBS Connected')
			this.context.connectionChanged(this.getStatus())
			this.context.resetToState(getDefaultState(this.context.getCurrentTime()))
		})
		this._obs.on(OBSConnectionEvents.Disconnected, () => {
			this.context.logger.debug('OBS Disconnected')
			this.context.connectionChanged(this.getStatus())
		})
		this._obs.on(OBSConnectionEvents.Error, (c, e) => this.context.logger.error('OBS: ' + c, e))

		this._obs.connect(this._options.host, this._options.port, this._options.password)

		return true
	}

	async terminate(): Promise<void> {
		this._obs?.disconnect()
	}

	get connected() {
		return this._obs?.connected ?? false
	}

	getStatus(): Omit<DeviceStatus, 'active'> {
		const statusDetails: DeviceStatus['statusDetails'] = []

		if (this._obs?.connected) {
			return {
				statusCode: StatusCode.GOOD,
				messages: [],
				statusDetails,
			}
		}

		const host = this._options?.host ?? ''
		const port = this._options?.port ?? 0

		statusDetails.push(
			createOBSStatusDetail(OBSStatusCode.DISCONNECTED, {
				deviceName: 'OBS',
				host,
				port,
				error: this._obs?.error,
			})
		)

		return {
			statusCode: StatusCode.BAD,
			messages: statusDetailsToMessages(statusDetails, OBSStatusMessages),
			statusDetails,
		}
	}

	readonly actions = null

	convertTimelineStateToDeviceState(
		state: DeviceTimelineState<TSRTimelineContent>,
		newMappings: Mappings
	): OBSDeviceState {
		return convertStateToOBS(state, newMappings)
	}

	diffStates(oldState: OBSDeviceState | undefined, newState: OBSDeviceState): Array<OBSCommandWithContext> {
		return diffStates(oldState ?? getDefaultState(newState.time), newState, (scene, source) =>
			this._obs?.getSceneItemId(scene, source)
		)
	}

	async sendCommand(command: OBSCommandWithContext): Promise<void> {
		if (!this._obs?.connected) return

		this.context.logger.debug(command)

		this._obs?.call(command.command.requestName, command.command.args).catch((e) => {
			this.context.commandError(e, command)
		})
	}
}
