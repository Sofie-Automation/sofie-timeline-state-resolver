import type {
	Device,
	CommandWithContext,
	DeviceContextAPI,
	DeviceTimelineState,
	DeviceTimelineStateObject,
} from 'timeline-state-resolver-api'
import {
	ActionExecutionResult,
	ActionExecutionResultCode,
	DeviceStatus,
	StatusCode,
	TSRTimelineContent,
	UdpSendCommandContent,
	UdpSendOptions,
	UdpSendActionMethods,
	UdpSendDeviceTypes,
	UdpSendActions,
} from 'timeline-state-resolver-types'
import { t } from '../../lib.js'
import _ from 'underscore'
import { UdpConnection } from './udpConnection.js'

export type UdpSendDeviceState = Record<string, DeviceTimelineStateObject<TSRTimelineContent>>

export type UdpSendDeviceCommand = CommandWithContext<
	{
		commandName: 'added' | 'changed' | 'removed' | 'manual'
		content: UdpSendCommandContent
		layer: string
	},
	string
>
export class UdpSendDevice implements Device<UdpSendDeviceTypes, UdpSendDeviceState, UdpSendDeviceCommand> {
	private activeLayers = new Map<string, string>()
	private _terminated = false

	private udpConnection = new UdpConnection()

	constructor(protected context: DeviceContextAPI<UdpSendDeviceState>) {
		// Nothing

		this.udpConnection.on('error', (errContext, err) => {
			this.context.logger.error(errContext, err)
		})
	}

	async init(options: UdpSendOptions): Promise<boolean> {
		// It is safe to await this 'connect', as it is simply awaiting the syscall to setup the socket, not for an actual connection
		await this.udpConnection.activate(options)

		return true
	}
	async terminate(): Promise<void> {
		this._terminated = true
		this.activeLayers.clear()
		await this.udpConnection.deactivate()
	}

	get connected(): boolean {
		// Note: UDP is connectionless, so we consider it always connected as long as it hasn't been terminated
		return !this._terminated
	}
	getStatus(): Omit<DeviceStatus, 'active'> {
		if (this._terminated) {
			return {
				statusCode: StatusCode.BAD,
				messages: [`Terminated`],
			}
		} else {
			return {
				statusCode: StatusCode.GOOD,
				messages: [],
			}
		}
	}

	readonly actions: UdpSendActionMethods = {
		[UdpSendActions.ResetState]: async () => {
			this.actionResetState()
			return { result: ActionExecutionResultCode.Ok }
		},
		[UdpSendActions.SendUdpCommand]: async (payload) => {
			return this.actionSendUdpCommand(payload)
		},
	}

	convertTimelineStateToDeviceState(state: DeviceTimelineState<TSRTimelineContent>): UdpSendDeviceState {
		return state.objects.reduce((acc, obj) => {
			if (obj.layer) acc[obj.layer] = obj
			return acc
		}, {} as UdpSendDeviceState)
	}
	diffStates(oldState: UdpSendDeviceState | undefined, newState: UdpSendDeviceState): Array<UdpSendDeviceCommand> {
		const commands: Array<UdpSendDeviceCommand> = []

		for (const [layerKey, newLayer] of Object.entries<DeviceTimelineStateObject<TSRTimelineContent>>(newState)) {
			const oldLayer = oldState?.[layerKey]
			// added/changed
			if (newLayer.content) {
				if (!oldLayer) {
					// added!
					commands.push({
						command: {
							commandName: 'added',
							content: newLayer.content as UdpSendCommandContent,
							layer: layerKey,
						},
						context: `added: ${newLayer.id}`,
						timelineObjId: newLayer.id,
					})
				} else {
					// changed?
					if (!_.isEqual(oldLayer.content, newLayer.content)) {
						// changed!
						commands.push({
							command: {
								commandName: 'changed',
								content: newLayer.content as UdpSendCommandContent,
								layer: layerKey,
							},
							context: `changed: ${newLayer.id}`,
							timelineObjId: newLayer.id,
						})
					}
				}
			}
		}
		// removed
		for (const [layerKey, oldLayer] of Object.entries<DeviceTimelineStateObject<TSRTimelineContent>>(oldState ?? {})) {
			const newLayer = newState[layerKey]
			if (!newLayer) {
				// removed!
				commands.push({
					command: {
						commandName: 'removed',
						content: oldLayer.content as UdpSendCommandContent,
						layer: layerKey,
					},
					context: `removed: ${oldLayer.id}`,
					timelineObjId: oldLayer.id,
				})
			}
		}
		commands.sort((a, b) => {
			const priorityDiff = (a.command.content.temporalPriority || 0) - (b.command.content.temporalPriority || 0)
			if (priorityDiff !== 0) return priorityDiff
			return a.command.layer.localeCompare(b.command.layer)
		})
		return commands
	}
	async sendCommand({ timelineObjId, context, command }: UdpSendDeviceCommand): Promise<void> {
		if (command.commandName === 'added' || command.commandName === 'changed') {
			this.activeLayers.set(command.layer, this.getActiveLayersHash(command))
		} else if (command.commandName === 'removed') {
			this.activeLayers.delete(command.layer)
		}

		if (command.layer && command.commandName !== 'manual') {
			const hash = this.activeLayers.get(command.layer)
			if (this.getActiveLayersHash(command) !== hash) return // command is no longer relevant to state
		}
		if (this._terminated) {
			return
		}

		this.context.logger.debug({ context, timelineObjId, command })

		await this.udpConnection.sendUDPMessage(command.content.message)
	}
	private async actionSendUdpCommand(cmd?: UdpSendCommandContent): Promise<ActionExecutionResult> {
		if (!cmd)
			return {
				result: ActionExecutionResultCode.Error,
				response: t('Failed to send command: Missing payload'),
			}
		if (!cmd.message) {
			return {
				result: ActionExecutionResultCode.Error,
				response: t('Failed to send command: Missing message'),
			}
		}
		try {
			await this.sendCommand({
				timelineObjId: '',
				context: 'makeReady',
				command: {
					commandName: 'manual',
					content: cmd,
					layer: '',
				},
			})
		} catch (error) {
			this.context.logger.warning('Manual UDP command failed: ' + JSON.stringify(cmd))
			return {
				result: ActionExecutionResultCode.Error,
				response: t('Error when sending UDP command: {{errorMessage}}', { errorMessage: `${error}` }),
			}
		}

		return { result: ActionExecutionResultCode.Ok }
	}
	private actionResetState() {
		this.activeLayers.clear()
		this.context.resetState()
	}
	private getActiveLayersHash(command: UdpSendDeviceCommand['command']): string {
		return JSON.stringify(command.content)
	}
}
