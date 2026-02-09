import * as _ from 'underscore'
import {
	DeviceType,
	OSCMessageCommandContent,
	Mappings,
	TSRTimelineContent,
	MultiOscOptions,
	SomeMappingMultiOsc,
	Mapping,
	DeviceStatus,
	StatusCode,
	MultiOscDeviceTypes,
} from 'timeline-state-resolver-types'
import type { Device, CommandWithContext, DeviceContextAPI, DeviceTimelineState } from 'timeline-state-resolver-api'
import { OSCConnection } from './deviceConnection'
import * as osc from 'osc'

export interface MultiOscInitTestOptions {
	oscSenders?: Record<string, (msg: osc.OscMessage, address?: string | undefined, port?: number | undefined) => void>
}

interface MultiOSCDeviceState {
	[connectionId: string]:
		| {
				[address: string]: OSCDeviceStateContent | undefined
		  }
		| undefined
}
interface OSCDeviceStateContent extends OSCMessageCommandContent {
	connectionId: string
	fromTlObject: string
}

export type MultiOscCommandWithContext = CommandWithContext<OSCDeviceStateContent, string>

/**
 * This is a generic wrapper for any osc-enabled device.
 */
export class MultiOSCMessageDevice
	implements Device<MultiOscDeviceTypes, MultiOSCDeviceState, MultiOscCommandWithContext>
{
	readonly actions = null

	private _connections: Record<string, OSCConnection> = {}
	private _commandQueue: Array<MultiOscCommandWithContext> = []
	private _commandQueueTimer: NodeJS.Timeout | undefined

	private _timeBetweenCommands: number | undefined

	constructor(protected context: DeviceContextAPI<MultiOSCDeviceState>) {
		// Nothing
	}

	async init(initOptions: MultiOscOptions, testOptions?: MultiOscInitTestOptions): Promise<boolean> {
		this._timeBetweenCommands = initOptions.timeBetweenCommands

		for (const connOptions of initOptions.connections) {
			const connectionId = connOptions.connectionId

			const connection = new OSCConnection()
			connection.on('error', (err) => this.context.logger.error('Error in MultiOSC connection ' + connectionId, err))
			connection.on('debug', (...args) => this.context.logger.debug('from connection ' + connectionId, ...args))
			this._connections[connectionId] = connection

			if (!connection) {
				this.context.logger.error(
					'Could not initialise device',
					new Error('Connection ' + connOptions.connectionId + ' not initialised')
				)
				continue
			}

			await connection.connect({
				...connOptions,
				oscSender: testOptions?.oscSenders?.[connOptions.connectionId] || undefined,
			})
		}

		// note - we reset here but might still be missing some connections from tcp devices, not worth fixing right now
		this.context.resetToState(Object.fromEntries(Object.keys(this._connections).map((id) => [id, {}])))

		return true
	}

	async terminate() {
		for (const connection of Object.values<OSCConnection>(this._connections)) {
			connection.dispose()
		}
	}

	get connected(): boolean {
		return false
	}
	getStatus(): Omit<DeviceStatus, 'active'> {
		const status = {
			statusCode: StatusCode.GOOD,
			messages: [] as string[],
		}

		for (const conn of Object.values<OSCConnection>(this._connections)) {
			if (!conn.connected) {
				status.statusCode = StatusCode.BAD
				status.messages.push(`${conn.connectionId} is disconnected`)
			}
		}

		return status
	}

	/**
	 * Transform the timeline state into a device state, which is in this case also
	 * a timeline state.
	 * @param state
	 */
	convertTimelineStateToDeviceState(
		state: DeviceTimelineState<TSRTimelineContent>,
		mappings: Mappings
	): MultiOSCDeviceState {
		const addrToOSCMessage: MultiOSCDeviceState = Object.fromEntries(
			Object.keys(this._connections).map((id) => [id, {}])
		)
		const addrToPriority: { [connectionId: string]: { [address: string]: number } } = Object.fromEntries(
			Object.keys(this._connections).map((id) => [id, {}])
		)

		for (const tlObject of state.objects) {
			const mapping = mappings[tlObject.layer] as Mapping<SomeMappingMultiOsc> | undefined
			if (!mapping) continue

			const connectionState = addrToOSCMessage[mapping.options.connectionId]
			if (!connectionState) continue

			if (tlObject.content.deviceType === DeviceType.OSC) {
				const content: OSCDeviceStateContent = {
					...tlObject.content,
					connectionId: mapping.options.connectionId,
					fromTlObject: tlObject.id,
				}
				if (
					(connectionState[content.path] &&
						addrToPriority[mapping.options.connectionId][content.path] <= (tlObject.priority || 0)) ||
					!connectionState[content.path]
				) {
					connectionState[content.path] = content
					addrToPriority[mapping.options.connectionId][content.path] = tlObject.priority || 0
				}
			}
		}

		return addrToOSCMessage
	}

	/**
	 * Compares the new timeline-state with the old one, and generates commands to account for the difference
	 * @param oldOscSendState The assumed current state
	 * @param newOscSendState The desired state of the device
	 */
	diffStates(
		oldOscSendState: MultiOSCDeviceState | undefined,
		newOscSendState: MultiOSCDeviceState
	): Array<MultiOscCommandWithContext> {
		// in this oscSend class, let's just cheat:

		const commands: Array<MultiOscCommandWithContext> = []

		for (const connectionId of Object.keys(this._connections)) {
			const oldConnectionState = oldOscSendState?.[connectionId]
			const newConnectionState = newOscSendState[connectionId] ?? {}

			for (const [address, newCommandContent] of Object.entries<OSCDeviceStateContent | undefined>(
				newConnectionState
			)) {
				if (!newCommandContent) continue

				const oldLayer = oldConnectionState?.[address]
				if (!oldLayer) {
					// added!
					commands.push({
						context: `added: ${newCommandContent.fromTlObject}`,
						timelineObjId: newCommandContent.fromTlObject,
						command: {
							// commandName: 'added',
							...newCommandContent,
							connectionId: newCommandContent.connectionId,
						},
					})
				} else {
					// changed?
					if (!_.isEqual(oldLayer, newCommandContent)) {
						// changed!
						commands.push({
							context: `changed: ${newCommandContent.fromTlObject}`,
							timelineObjId: newCommandContent.fromTlObject,
							command: {
								// commandName: 'changed',
								...newCommandContent,
								connectionId: newCommandContent.connectionId,
							},
						})
					}
				}
			}
		}

		return commands
	}

	async sendCommand(command: MultiOscCommandWithContext): Promise<any> {
		this.context.logger.debug(command)

		this._commandQueue.push(command)

		this._processQueue()
	}

	private _processQueue() {
		if (this._commandQueueTimer) return

		const nextCommand = this._commandQueue.shift()
		if (!nextCommand) return

		try {
			this._connections[nextCommand.command.connectionId]?.sendOsc({
				address: nextCommand.command.path,
				args: nextCommand.command.values,
			})
		} catch (e) {
			this.context.commandError(new Error('Command failed: ' + e), { ...nextCommand, command: nextCommand })
		}

		this._commandQueueTimer = setTimeout(() => {
			this._commandQueueTimer = undefined
			this._processQueue()
		}, this._timeBetweenCommands || 0)
	}
}
