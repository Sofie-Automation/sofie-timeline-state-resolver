import {
	DeviceStatus,
	LawoDeviceTypes,
	LawoError,
	LawoErrorCode,
	LawoErrorMessages,
	LawoOptions,
	Mappings,
	SomeMappingLawo,
	StatusCode,
	TSRTimelineContent,
} from 'timeline-state-resolver-types'
import type { Device, DeviceContextAPI, DeviceTimelineState } from 'timeline-state-resolver-api'

import Debug from 'debug'
import { convertTimelineStateToLawoState, LawoState } from './state.js'
import { LawoCommandWithContext, diffLawoStates, LawoCommandType } from './diff.js'
import { LawoConnection } from './connection.js'
import { createLawoError } from './errors.js'
import { errorsToMessages } from '../../deviceErrorMessages.js'
const debug = Debug('timeline-state-resolver:lawo')

export class LawoDevice implements Device<LawoDeviceTypes, LawoState, LawoCommandWithContext> {
	private _lawo: LawoConnection | undefined

	constructor(protected context: DeviceContextAPI<LawoState>) {
		// Nothing
	}

	async init(options: LawoOptions): Promise<boolean> {
		this._lawo = new LawoConnection(options, this.context.getCurrentTime)
		this._lawo.on('error', (context, e) => this.context.logger.error('Lawo.LawoConnection ' + context, e))
		this._lawo.on('debug', (...debug) => this.context.logger.debug('Lawo.LawoConnection', ...debug))
		this._lawo.on('connected', (firstConnection) => {
			if (firstConnection) {
				// reset state
				this.context.resetToState({ faders: [], nodes: [] })
			}
			this.context.connectionChanged(this.getStatus())
		})
		this._lawo.on('disconnected', () => {
			this.context.connectionChanged(this.getStatus())
		})

		return Promise.resolve(true)
	}
	async terminate(): Promise<void> {
		this._lawo?.terminate().catch((e) => this.context.logger.error('Error when terminating', e))
	}

	convertTimelineStateToDeviceState(
		timelineState: DeviceTimelineState<TSRTimelineContent>,
		mappings: Mappings<SomeMappingLawo>
	): LawoState {
		return convertTimelineStateToLawoState(timelineState, mappings)
	}
	diffStates(oldState: LawoState | undefined, newState: LawoState): Array<LawoCommandWithContext> {
		return diffLawoStates(oldState, newState)
	}
	async sendCommand(cwc: LawoCommandWithContext): Promise<any> {
		const { command } = cwc
		this.context.logger.debug(cwc)
		debug(command)

		try {
			const cmdType = command.type
			if (command.type === LawoCommandType.FaderRamp) {
				await this._lawo?.rampFader(command, cwc.timelineObjId)
			} else if (command.type === LawoCommandType.SetValue) {
				await this._lawo?.setValue(command, cwc.timelineObjId)
			} else {
				throw new Error(`Unsupported command type "${cmdType}"`)
			}
		} catch (e) {
			const error = e as Error
			let errorString = error && error.message ? error.message : error.toString()
			if (error?.stack) {
				errorString += error.stack
			}
			this.context.commandError(new Error(errorString), cwc)
		}
	}

	get connected(): boolean {
		return this._lawo?.connected ?? false
	}
	getStatus(): Omit<DeviceStatus, 'active'> {
		let statusCode = StatusCode.GOOD
		const errors: LawoError[] = []

		if (!this._lawo?.connected) {
			statusCode = StatusCode.BAD
			errors.push(createLawoError(LawoErrorCode.NOT_CONNECTED, {}))
		}

		return {
			statusCode: statusCode,
			messages: errorsToMessages(errors, LawoErrorMessages),
			errors,
		}
	}

	readonly actions = null
}
