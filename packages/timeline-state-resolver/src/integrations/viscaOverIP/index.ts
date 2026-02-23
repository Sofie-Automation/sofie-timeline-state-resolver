import type { Device, DeviceContextAPI, DeviceTimelineState } from 'timeline-state-resolver-api'
import {
	ActionExecutionResult,
	ActionExecutionResultCode,
	DeviceStatus,
	Mappings,
	StatusCode,
	TSRTimelineContent,
	ViscaOverIPActionMethods,
	ViscaOverIPActions,
	ViscaOverIPDeviceTypes,
	ViscaOverIPOptions,
} from 'timeline-state-resolver-types'

import * as ConnectionEnums from './connection/enums.js'
import { ViscaCommand, ViscaDevice, ViscaInquiryCommand } from './connection/index.js'
import { PanTiltDriveCommand, PresetCommand, ZoomCommand } from './connection/commands/visca/index.js'
import { FocusCommand } from './connection/commands/visca/focusCommand.js'
import { FocusModeCommand } from './connection/commands/visca/focusModeCommand.js'
import { FocusOnePushTriggerCommand } from './connection/commands/visca/focusOnePushTriggerCommand.js'
import {
	FocusModeInquiryCommand,
	FocusPositionInquiryCommand,
	PanTiltPositionInquiryCommand,
	ZoomPositionInquiryCommand,
} from './connection/commands/inquiry/index.js'
import { ViscaValueConverter } from './connection/lib/ViscaValueConverter.js'
import { ViscaOverIpDeviceState, convertStateToVisca, getDefaultState } from './state.js'
import { ViscaOverIpCommandWithContext, diffViscaStates } from './diff.js'

export class ViscaOverIpDevice implements Device<
	ViscaOverIPDeviceTypes,
	ViscaOverIpDeviceState,
	ViscaOverIpCommandWithContext
> {
	protected _terminated = false

	protected connection: ViscaDevice | undefined

	protected readonly converter = new ViscaValueConverter()

	constructor(protected context: DeviceContextAPI<ViscaOverIpDeviceState>) {
		// Nothing
	}

	async init(options: ViscaOverIPOptions): Promise<boolean> {
		this.connection = new ViscaDevice(options.host, options.port, true, (...args) =>
			this.context.logger.debug(JSON.stringify(args))
		)
		this.connection.connect()
		return true
	}

	async terminate(): Promise<void> {
		this._terminated = true
		this.connection?.disconnect()
	}

	get connected(): boolean {
		return false
	}

	getStatus(): Omit<DeviceStatus, 'active'> {
		return {
			statusCode: StatusCode.GOOD,
			messages: [],
		}
	}

	readonly actions: ViscaOverIPActionMethods = {
		[ViscaOverIPActions.RecallPreset]: async (payload) => {
			const presetCommand = new PresetCommand(ConnectionEnums.PresetOperation.Recall, payload.presetNumber)
			return this.safelySendActionCommand(presetCommand)
		},
		[ViscaOverIPActions.StorePreset]: async (payload) => {
			const presetCommand = new PresetCommand(ConnectionEnums.PresetOperation.Set, payload.presetNumber)
			return this.safelySendActionCommand(presetCommand)
		},
		[ViscaOverIPActions.ResetPreset]: async (payload) => {
			const presetCommand = new PresetCommand(ConnectionEnums.PresetOperation.Reset, payload.presetNumber)
			return this.safelySendActionCommand(presetCommand)
		},
		[ViscaOverIPActions.SetPanTiltSpeed]: async (payload) => {
			const panTiltCommand = new PanTiltDriveCommand(
				this.converter.mapPanTiltSpeedToViscaDirection(payload.panSpeed, payload.tiltSpeed),
				this.converter.mapPanTiltSpeedToVisca(payload.panSpeed),
				this.converter.mapPanTiltSpeedToVisca(payload.tiltSpeed)
			)
			return this.safelySendActionCommand(panTiltCommand)
		},
		[ViscaOverIPActions.GetPanTiltPosition]: async () =>
			this.safelyExecuteCommand(async () =>
				this.converter.mapPanTiltPositionFromVisca(
					await this.connection!.sendCommand(new PanTiltPositionInquiryCommand())
				)
			),
		[ViscaOverIPActions.SetZoomSpeed]: async (payload) => {
			const zoomCommand = new ZoomCommand(
				this.converter.mapZoomSpeedToViscaDirection(payload.zoomSpeed),
				this.converter.mapZoomSpeedToVisca(payload.zoomSpeed)
			)
			return this.safelySendActionCommand(zoomCommand)
		},
		[ViscaOverIPActions.GetZoomPosition]: async () =>
			this.safelyExecuteCommand(async () =>
				this.converter.mapZoomPositionFromVisca(await this.connection!.sendCommand(new ZoomPositionInquiryCommand()))
			),
		[ViscaOverIPActions.SetFocusSpeed]: async (payload) => {
			const focusCommand = new FocusCommand(
				this.converter.mapFocusSpeedToViscaDirection(payload.focusSpeed),
				this.converter.mapFocusSpeedToVisca(payload.focusSpeed)
			)
			return this.safelySendActionCommand(focusCommand)
		},
		[ViscaOverIPActions.SetFocusMode]: async (payload) => {
			const focusCommand = new FocusModeCommand(this.converter.mapFocusModeToVisca(payload.mode))
			return this.safelySendActionCommand(focusCommand)
		},
		[ViscaOverIPActions.TriggerOnePushFocus]: async () => {
			const focusCommand = new FocusOnePushTriggerCommand()
			return this.safelySendActionCommand(focusCommand)
		},
		[ViscaOverIPActions.GetFocusPosition]: async () =>
			this.safelyExecuteCommand(async () =>
				this.converter.mapFocusPositionFromVisca(await this.connection!.sendCommand(new FocusPositionInquiryCommand()))
			),
		[ViscaOverIPActions.GetFocusMode]: async () =>
			this.safelyExecuteCommand(async () =>
				this.converter.mapFocusModeFromVisca(await this.connection!.sendCommand(new FocusModeInquiryCommand()))
			),
	}

	private async safelyExecuteCommand<TRes>(fun: () => Promise<TRes>): Promise<ActionExecutionResult<TRes>> {
		try {
			const resultData = await fun()
			return {
				result: ActionExecutionResultCode.Ok,
				resultData,
			}
		} catch {
			return {
				result: ActionExecutionResultCode.Error,
			}
		}
	}

	private async safelySendActionCommand(command: ViscaCommand | ViscaInquiryCommand): Promise<ActionExecutionResult> {
		let resultData: any = undefined
		try {
			resultData = await this.connection?.sendCommand(command)
		} catch {
			return {
				result: ActionExecutionResultCode.Error,
			}
		}

		return {
			result: ActionExecutionResultCode.Ok,
			resultData,
		}
	}

	convertTimelineStateToDeviceState(
		state: DeviceTimelineState<TSRTimelineContent>,
		newMappings: Mappings
	): ViscaOverIpDeviceState {
		return convertStateToVisca(state, newMappings)
	}

	diffStates(
		oldState: ViscaOverIpDeviceState | undefined,
		newState: ViscaOverIpDeviceState
	): Array<ViscaOverIpCommandWithContext> {
		return diffViscaStates(this.converter, oldState ?? getDefaultState(), newState)
	}

	async sendCommand(command: ViscaOverIpCommandWithContext): Promise<void> {
		try {
			await this.connection?.sendCommand(command.command)
		} catch (e) {
			this.context.logger.error('ViscaOverIP: sendCommand error', e as Error)
		}
	}
}
