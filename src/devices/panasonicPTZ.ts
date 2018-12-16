import * as _ from 'underscore'
import {
	DeviceWithState,
	CommandWithContext,
	DeviceStatus,
	StatusCode
} from './device'
import {
	DeviceType,
	DeviceOptions,
	Mappings,
	TimelineObjPanasonicPtzPreset,
	TimelineObjPanasonicPtzPresetSpeed,
	TimelineObjPanasonicPtzZoomSpeed,
	TimelineObjPanasonicPtzZoom,
	TimelineContentTypePanasonicPtz,
	MappingPanasonicPtz,
	MappingPanasonicPtzType
} from '../types/src'
import { TimelineState, TimelineResolvedObject } from 'superfly-timeline'
import { DoOnTime } from '../doOnTime'
import { PanasonicPtzHttpInterface } from './panasonicPTZAPI'

export interface PanasonicPtzOptions extends DeviceOptions { // TODO - this doesnt match the others
	options?: {
		commandReceiver?: (time: number, cmd) => Promise<any>,
		host?: string
		port?: number
		https?: boolean
	}
}

export interface PanasonicPtzState {
	speed: number | undefined,
	preset: number | undefined,
	zoomSpeed: number | undefined,
	zoom: number | undefined
}

export interface PanasonicPtzCommand {
	type: TimelineContentTypePanasonicPtz,
	speed?: number,
	preset?: number,
	zoomSpeed?: number, // -1 is full speed WIDE, +1 is full speed TELE, 0 is stationary
	zoom?: number // 0 is WIDE, 1 is TELE
}
export interface PanasonicPtzCommandWithContext {
	command: PanasonicPtzCommand,
	context: CommandContext
}
type CommandContext = any

const PROBE_INTERVAL = 10 * 1000 // Probe every 10s
export class PanasonicPtzDevice extends DeviceWithState<TimelineState> {
	private _doOnTime: DoOnTime
	private _device: PanasonicPtzHttpInterface | undefined
	private _connected: boolean = false

	private _commandReceiver: (time: number, cmd: PanasonicPtzCommand, context: CommandContext) => Promise<any>

	constructor (deviceId: string, deviceOptions: PanasonicPtzOptions, options) {
		super(deviceId, deviceOptions, options)
		if (deviceOptions.options) {
			if (deviceOptions.options.commandReceiver) {
				this._commandReceiver = deviceOptions.options.commandReceiver
			} else {
				this._commandReceiver = this._defaultCommandReceiver
			}
		}
		this._doOnTime = new DoOnTime(() => {
			return this.getCurrentTime()
		})
		this._doOnTime.on('error', e => this.emit('error', 'doOnTime', e))

		if (deviceOptions.options && deviceOptions.options.host) {
			this._device = new PanasonicPtzHttpInterface(deviceOptions.options.host, deviceOptions.options.port, deviceOptions.options.https)
			this._device.on('error', (msg) => {
				this.emit('error', 'PanasonicPtzHttpInterface', msg)
			})
			this._device.on('disconnected', (msg) => {
				this.emit('error', 'PanasonicPtzHttpInterface disconnected', msg)
				this._setConnected(false)
			})
			this._device.on('debug', (...args) => {
				this.emit('debug', 'Panasonic PTZ', ...args)
			})
		} else {
			this._device = undefined
		}
	}

	init (): Promise<boolean> {
		if (this._device) {
			return new Promise((resolve, reject) => {
				this._device!.ping().then((result) => {
					this._setConnected(!!result)

					if (result) {
						setInterval(() => {
							this._device!.ping().then((result) => {
								this._setConnected(!!result)
							}).catch((e) => {
								this.emit('error', 'ping', e)
								this._setConnected(false)
							})
						}, PROBE_INTERVAL)
					}

					resolve(true)
				}).catch((e) => {
					reject(e)
				})
			})
		}
		// @ts-ignore no-unused-vars
		return Promise.reject('There are no cameras set up for this device')
	}

	convertStateToPtz (state: TimelineState): PanasonicPtzState {
		// convert the timeline state into something we can use
		const ptzState: PanasonicPtzState = this._getDefaultState()

		_.each(state.LLayers, (tlObject: TimelineResolvedObject, layerName: string) => {
			const mapping: MappingPanasonicPtz | undefined = this.mapping[layerName] as MappingPanasonicPtz // tslint:disable-line
			if (mapping && mapping.device === DeviceType.PANASONIC_PTZ) {
				if (mapping.mappingType === MappingPanasonicPtzType.PRESET) {
					let tlObjectSource = tlObject as TimelineResolvedObject & TimelineObjPanasonicPtzPreset
					_.extend(ptzState, {
						preset: tlObjectSource.content.preset
					})
				} else if (mapping.mappingType === MappingPanasonicPtzType.PRESET_SPEED) {
					let tlObjectSource = tlObject as TimelineResolvedObject & TimelineObjPanasonicPtzPresetSpeed
					_.extend(ptzState, {
						speed: tlObjectSource.content.speed
					})
				} else if (mapping.mappingType === MappingPanasonicPtzType.ZOOM_SPEED) {
					let tlObjectSource = tlObject as TimelineResolvedObject & TimelineObjPanasonicPtzZoomSpeed
					_.extend(ptzState, {
						zoomSpeed: tlObjectSource.content.zoomSpeed
					})
				} else if (mapping.mappingType === MappingPanasonicPtzType.ZOOM) {
					let tlObjectSource = tlObject as TimelineResolvedObject & TimelineObjPanasonicPtzZoom
					_.extend(ptzState, {
						zoom: tlObjectSource.content.zoom
					})
				}
			}
		})

		return ptzState
	}

	handleState (newState: TimelineState) {
		// Handle this new state, at the point in time specified
		let oldState: TimelineState = (this.getStateBefore(newState.time) || { state: { time: 0, LLayers: {}, GLayers: {} } }).state

		let oldPtzState = this.convertStateToPtz(oldState)
		let newPtzState = this.convertStateToPtz(newState)

		let commandsToAchieveState: Array<PanasonicPtzCommandWithContext> = this._diffStates(oldPtzState, newPtzState)

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
		if (this._device) {
			this._device.dispose()
		}
		return Promise.resolve(true)
	}
	getStatus (): DeviceStatus {
		return {
			statusCode: this._connected ? StatusCode.GOOD : StatusCode.BAD
		}
	}
	private _getDefaultState (): PanasonicPtzState {
		return {
			preset: undefined,
			speed: undefined,
			zoomSpeed: 0,
			zoom: undefined
		}
	}

	// @ts-ignore no-unused-vars
	private _defaultCommandReceiver (time: number, cmd: PanasonicPtzCommand, context: CommandContext): Promise<any> {
		let cwc: CommandWithContext = {
			context: context,
			command: cmd
		}
		if (cmd.type === TimelineContentTypePanasonicPtz.PRESET) {
			if (this._device && cmd.preset !== undefined) {
				this.emit('debug', cwc)
				this._device.recallPreset(cmd.preset)
				.then((res) => {
					this.emit('debug', `Panasonic PTZ result: ${res}`)
				})
				.catch((e) => this.emit('error', 'PTZ.recallPreset', e))
			} // @todo: else: add throw here?
		} else if (cmd.type === TimelineContentTypePanasonicPtz.SPEED) {
			if (this._device && cmd.speed !== undefined) {
				this.emit('debug', cwc)
				this._device.setSpeed(cmd.speed)
				.then((res) => {
					this.emit('debug', `Panasonic PTZ result: ${res}`)
				})
				.catch((e) => this.emit('error', 'PTZ.setSpeed', e))
			} // @todo: else: add throw here?
		} else if (cmd.type === TimelineContentTypePanasonicPtz.ZOOM_SPEED) {
			if (this._device && cmd.zoomSpeed !== undefined) {
				this.emit('debug', cwc)
				// scale -1 - 0 - +1 range to 01 - 50 - 99 range
				this._device.setZoomSpeed((cmd.zoomSpeed * 49) + 50)
				.then((res) => {
					this.emit('debug', `Panasonic PTZ result: ${res}`)
				})
				.catch((e) => this.emit('error', 'PTZ.setZoomSpeed', e))
			} // @todo: else: add throw here?
		} else if (cmd.type === TimelineContentTypePanasonicPtz.ZOOM) {
			if (this._device && cmd.zoom !== undefined) {
				this.emit('debug', cwc)
				// scale 0 - +1 range to 555h - FFFh range
				this._device.setZoom((cmd.zoom * 0xAAA) + 0x555)
				.then((res) => {
					this.emit('debug', `Panasonic PTZ result: ${res}`)
				})
				.catch((e) => this.emit('error', 'PTZ.setZoom', e))
			} // @todo: else: add throw here?
		}
	}

	private _addToQueue (commandsToAchieveState: Array<PanasonicPtzCommandWithContext>, time: number) {
		_.each(commandsToAchieveState, (cmd: PanasonicPtzCommandWithContext) => {

			// add the new commands to the queue:
			this._doOnTime.queue(time, (cmd: PanasonicPtzCommandWithContext) => {
				return this._commandReceiver(time, cmd.command, cmd.context)
			}, cmd)
		})
	}
	private _diffStates (oldPtzState: PanasonicPtzState, newPtzState: PanasonicPtzState): Array<PanasonicPtzCommandWithContext> {

		let commands: Array<PanasonicPtzCommandWithContext> = []

		let addCommands = (newNode: PanasonicPtzState, oldValue: PanasonicPtzState) => {
			if (newNode.preset !== oldValue.preset && newNode.preset !== undefined) {
				commands.push({
					command: {
						type: TimelineContentTypePanasonicPtz.PRESET,
						preset: newNode.preset
					},
					context: `preset differ (${newNode.preset}, ${oldValue.preset})`
				})
			}
			if (newNode.speed !== oldValue.speed && newNode.speed !== undefined) {
				commands.push({
					command: {
						type: TimelineContentTypePanasonicPtz.SPEED,
						speed: newNode.speed
					},
					context: `preset spped differ (${newNode.speed}, ${oldValue.speed})`
				})
			}
			if (newNode.zoomSpeed !== oldValue.zoomSpeed && newNode.zoomSpeed !== undefined) {
				commands.push({
					command: {
						type: TimelineContentTypePanasonicPtz.ZOOM_SPEED,
						speed: newNode.zoomSpeed
					},
					context: `zoom speed differ (${newNode.zoomSpeed}, ${oldValue.zoomSpeed})`
				})
			}
			if (newNode.zoom !== oldValue.zoom && newNode.zoom !== undefined) {
				commands.push({
					command: {
						type: TimelineContentTypePanasonicPtz.ZOOM,
						zoom: newNode.zoom
					},
					context: `zoom speed differ (${newNode.zoom}, ${oldValue.zoom})`
				})
			}
		}

		if (!_.isEqual(newPtzState, oldPtzState)) {
			addCommands(newPtzState, oldPtzState)
		}
		return commands
	}

	get canConnect (): boolean {
		return true
	}
	get connected (): boolean {
		return this._connected
	}
	get deviceType () {
		return DeviceType.PANASONIC_PTZ
	}
	get deviceName (): string {
		return 'Panasonic PTZ ' + this.deviceId
	}
	get queue () {
		return this._doOnTime.getQueue()
	}

	set mapping (mappings: Mappings) {
		super.mapping = mappings
	}
	get mapping () {
		return super.mapping
	}
	private _setConnected (connected: boolean) {
		if (this._connected !== connected) {
			this._connected = connected
			this._connectionChanged()
		}
	}
	private _connectionChanged () {
		this.emit('connectionChanged', this.getStatus())
	}
}
