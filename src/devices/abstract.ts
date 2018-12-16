import * as _ from 'underscore'
import {
	DeviceWithState,
	CommandWithContext,
	DeviceStatus,
	StatusCode
} from './device'
import { DeviceType, DeviceOptions } from '../types/src'

import { TimelineState, TimelineResolvedObject } from 'superfly-timeline'
import { DoOnTime } from '../doOnTime'

/*
	This is a wrapper for an "Abstract" device

	An abstract device is just a test-device that doesn't really do anything, but can be used
	as a preliminary mock
*/
export interface AbstractDeviceOptions extends DeviceOptions {
	options?: {
		commandReceiver?: (time: number, cmd) => Promise<any>
	}
}
export interface Command {
	commandName: string,
	content: CommandContent,
	context: CommandContext
}
type CommandContent = any
type CommandContext = string
export class AbstractDevice extends DeviceWithState<TimelineState> {
	private _doOnTime: DoOnTime
	// private _queue: Array<any>

	private _commandReceiver: (time: number, cmd: Command, context: CommandContext) => Promise<any>

	constructor (deviceId: string, deviceOptions: AbstractDeviceOptions, options) {
		super(deviceId, deviceOptions, options)
		if (deviceOptions.options) {
			if (deviceOptions.options.commandReceiver) this._commandReceiver = deviceOptions.options.commandReceiver
			else this._commandReceiver = this._defaultCommandReceiver
		}
		this._doOnTime = new DoOnTime(() => {
			return this.getCurrentTime()
		})
		this._doOnTime.on('error', e => this.emit('error', 'doOnTime', e))
	}

	/**
	 * Initiates the connection with CasparCG through the ccg-connection lib.
	 */
	init (): Promise<boolean> {
		return new Promise((resolve/*, reject*/) => {
			// This is where we would do initialization, like connecting to the devices, etc
			resolve(true)
		})
	}
	handleState (newState: TimelineState) {
		// Handle this new state, at the point in time specified

		let oldState: TimelineState = (this.getStateBefore(newState.time) || { state: { time: 0, LLayers: {}, GLayers: {} } }).state

		let oldAbstractState = this.convertStateToAbstract(oldState)
		let newAbstractState = this.convertStateToAbstract(newState)

		let commandsToAchieveState: Array<Command> = this._diffStates(oldAbstractState, newAbstractState)

		// clear any queued commands later than this time:
		this._doOnTime.clearQueueNowAndAfter(newState.time)
		// add the new commands to the queue:
		this._addToQueue(commandsToAchieveState, newState.time)

		// store the new state, for later use:
		this.setState(newState, newState.time)
	}
	clearFuture (clearAfterTime: number) {
		// Clear any scheduled commands after this time
		this._doOnTime.clearQueueAfter(clearAfterTime)
	}
	terminate () {
		this._doOnTime.dispose()
		return Promise.resolve(true)
	}
	get canConnect (): boolean {
		return false
	}
	get connected (): boolean {
		return false
	}
	convertStateToAbstract (state: TimelineState) {
		// convert the timeline state into something we can use
		return state
	}
	get deviceType () {
		return DeviceType.ABSTRACT
	}
	get deviceName (): string {
		return 'Abstract ' + this.deviceId
	}
	get queue () {
		return this._doOnTime.getQueue()
	}
	getStatus (): DeviceStatus {
		return {
			statusCode: StatusCode.GOOD
		}
	}
	private _addToQueue (commandsToAchieveState: Array<Command>, time: number) {
		_.each(commandsToAchieveState, (cmd: Command) => {

			// add the new commands to the queue:
			this._doOnTime.queue(time, (cmd: Command) => {
				return this._commandReceiver(time, cmd, cmd.context)
			}, cmd)
		})
	}
	private _diffStates (oldAbstractState: TimelineState, newAbstractState: TimelineState) {
		// in this abstract class, let's just cheat:

		let commands: Array<Command> = []

		_.each(newAbstractState.LLayers, (newLayer: TimelineResolvedObject, layerKey) => {
			let oldLayer = oldAbstractState.LLayers[layerKey]
			if (!oldLayer) {
				// added!
				commands.push({
					commandName: 'addedAbstract',
					content: newLayer.content,
					context: `added: ${newLayer.id}`
				})
			} else {
				// changed?
				if (oldLayer.id !== newLayer.id) {
					// changed!
					commands.push({
						commandName: 'changedAbstract',
						content: newLayer.content,
						context: `changed: ${newLayer.id}`
					})
				}
			}
		})
		// removed
		_.each(oldAbstractState.LLayers, (oldLayer: TimelineResolvedObject, layerKey) => {
			let newLayer = newAbstractState.LLayers[layerKey]
			if (!newLayer) {
				// removed!
				commands.push({
					commandName: 'removedAbstract',
					content: oldLayer.content,
					context: `removed: ${oldLayer.id}`
				})
			}
		})
		return commands
	}
	private _defaultCommandReceiver (time: number, cmd: Command, context: CommandContext): Promise<any> {
		time = time

		// emit the command to debug:
		let cwc: CommandWithContext = {
			context: context,
			command: {
				commandName: cmd.commandName,
				content: cmd.content
			}
		}
		this.emit('debug', cwc)

		// Note: In the Abstract case, the execution does nothing

		return Promise.resolve()
	}
}
