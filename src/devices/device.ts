import * as _ from 'underscore'
import { TimelineState } from 'superfly-timeline'
import {
	Mappings,
	DeviceType,
	DeviceOptions
} from '../types/src'
import { EventEmitter } from 'events'
/*
	This is a base class for all the Device wrappers.
	The Device wrappers will
*/

export interface DeviceCommand {
	time: number,
	deviceId: string,
	command: any
}

export interface DeviceCommandContainer {
	deviceId: string,
	commands: Array<DeviceCommand>
}
export interface CommandWithContext {
	context: any,
	command: any
}
export enum StatusCode {
	UNKNOWN = 0, 		// Status unknown
	GOOD = 1, 			// All good and green
	WARNING_MINOR = 2,	// Everything is not OK, operation is not affected
	WARNING_MAJOR = 3, 	// Everything is not OK, operation might be affected
	BAD = 4, 			// Operation affected, possible to recover
	FATAL = 5			// Operation affected, not possible to recover without manual interference
}
export interface DeviceStatus {
	statusCode: StatusCode,
	messages?: Array<string>
}

export function literal<T> (o: T) { return o }

interface IDevice {
	on (event: 'info',  	listener: (info: any) => void): this
	on (event: 'warning', 	listener: (warning: any) => void): this
	on (event: 'error', 	listener: (err: Error) => void): this
	on (event: 'debug', 	listener: (...debug: any[]) => void): this
}
export abstract class Device extends EventEmitter implements IDevice {

	private _getCurrentTime: () => number

	private _deviceId: string
	private _deviceOptions: DeviceOptions

	private _mappings: Mappings

	constructor (deviceId: string, deviceOptions: DeviceOptions, options) {
		super()
		this._deviceId = deviceId
		this._deviceOptions = deviceOptions

		this._deviceOptions = this._deviceOptions // ts-lint fix

		if (options.getCurrentTime) {
			this._getCurrentTime = options.getCurrentTime
		}
	}

	/**
	 * Connect to the device, resolve the promise when ready.
	 * @param connectionOptions Device-specific options
	 */
	abstract init (connectionOptions: any): Promise<boolean>
	terminate (): Promise<boolean> {
		return Promise.resolve(true)
	}
	getCurrentTime () {
		if (this._getCurrentTime) return this._getCurrentTime()
		return Date.now()
	}

	abstract handleState (newState: TimelineState)
	/**
	 * Clear any scheduled commands after this time
	 * @param clearAfterTime
	 */
	abstract clearFuture (clearAfterTime: number)
	abstract get canConnect (): boolean
	abstract get connected (): boolean

	/**
	 * The makeReady method could be triggered at a time before broadcast
	 * Whenever we know that the user want's to make sure things are ready for broadcast
	 * The exact implementation differ between different devices
	 * @param okToDestroyStuff If true, the device may do things that might affect the output (temporarily)
	 */
	makeReady (okToDestroyStuff?: boolean): Promise<void> {
		// This method should be overwritten by child
		okToDestroyStuff = okToDestroyStuff
		return Promise.resolve()
	}
	/**
	 * The standDown event could be triggered at a time after broadcast
	 * The exact implementation differ between different devices
	 * @param okToDestroyStuff If true, the device may do things that might affect the output (temporarily)
	 */
	standDown (okToDestroyStuff?: boolean): Promise<void> {
		// This method should be overwritten by child
		okToDestroyStuff = okToDestroyStuff
		return Promise.resolve()
	}
	abstract getStatus (): DeviceStatus

	get mapping (): Mappings {
		return this._mappings
	}
	set mapping (mappings: Mappings) {
		this._mappings = mappings
	}

	get deviceId () {
		return this._deviceId
	}
	set deviceId (deviceId) {
		this._deviceId = deviceId
	}
	/**
	 * A human-readable name for this device
	 */
	abstract get deviceName (): string
	abstract get deviceType (): DeviceType
	get deviceOptions (): DeviceOptions {
		return this._deviceOptions
	}
// }

// export abstract class DeviceWithState<T> extends Device {
// 	private _states: {[time: string]: T} = {}
// 	private _setStateCount: number = 0

// 	getStateBefore (time: number): {state: T, time: number} | null {
// 		let foundTime = 0
// 		let foundState: T | null = null
// 		_.each(this._states, (state: T, stateTimeStr: string) => {
// 			let stateTime = parseFloat(stateTimeStr)
// 			if (stateTime > foundTime && stateTime < time) {
// 				foundState = state
// 				foundTime = stateTime
// 			}
// 		})
// 		if (foundState) {
// 			return {
// 				state: foundState,
// 				time: foundTime
// 			}
// 		}
// 		return null
// 	}
// 	setState (state: T, time: number) {
// 		if (!time) throw new Error('setState: falsy time')
// 		this._states[time + ''] = state

// 		this.cleanUpStates(0, time) // remove states after this time, as they are not relevant anymore
// 		this._setStateCount++
// 		if (this._setStateCount > 10) {
// 			this._setStateCount = 0

// 			// Clean up old states:
// 			let stateBeforeNow = this.getStateBefore(this.getCurrentTime())
// 			if (stateBeforeNow && stateBeforeNow.time) {
// 				this.cleanUpStates(stateBeforeNow.time - 1, 0)
// 			}
// 		}
// 	}
// 	cleanUpStates (removeBeforeTime: number, removeAfterTime: number) {
// 		_.each(_.keys(this._states), (stateTimeStr: string) => {
// 			let stateTime = parseFloat(stateTimeStr)
// 			if (
// 				(
// 					removeBeforeTime &&
// 					stateTime < removeBeforeTime
// 				) ||
// 				(
// 					removeAfterTime &&
// 					stateTime > removeAfterTime
// 				) ||
// 				!stateTime) {
// 				delete this._states[stateTime]
// 			}
// 		})
// 	}
// 	clearStates () {
// 		_.each(_.keys(this._states), (time: string) => {
// 			delete this._states[time]
// 		})
// 	}
}

export abstract class DeviceWithState<T> extends Device {
	private _states: {[time: string]: T} = {}
	private _setStateCount: number = 0

	getStateBefore (time: number): {state: T, time: number} | null {
		let foundTime = 0
		let foundState: T | null = null
		_.each(this._states, (state: T, stateTimeStr: string) => {
			let stateTime = parseFloat(stateTimeStr)
			if (stateTime > foundTime && stateTime < time) {
				foundState = state
				foundTime = stateTime
			}
		})
		if (foundState) {
			return {
				state: foundState,
				time: foundTime
			}
		}
		return null
	}
	setState (state: T, time: number) {
		// if (!state.time) throw new Error('setState: falsy state.time')
		if (!time) throw new Error('setState: falsy time')
		this._states[time + ''] = state

		this.cleanUpStates(0, time) // remove states after this time, as they are not relevant anymore
		this._setStateCount++
		if (this._setStateCount > 10) {
			this._setStateCount = 0

			// Clean up old states:
			let stateBeforeNow = this.getStateBefore(this.getCurrentTime())
			if (stateBeforeNow && stateBeforeNow.time) {
				this.cleanUpStates(stateBeforeNow.time - 1, 0)
			}
		}
	}
	cleanUpStates (removeBeforeTime: number, removeAfterTime: number) {
		_.each(_.keys(this._states), (stateTimeStr: string) => {
			let stateTime = parseFloat(stateTimeStr)
			if (
				(
					removeBeforeTime &&
					stateTime < removeBeforeTime
				) ||
				(
					removeAfterTime &&
					stateTime > removeAfterTime
				) ||
				!stateTime) {
				delete this._states[stateTime]
			}
		})
	}
	clearStates () {
		_.each(_.keys(this._states), (time: string) => {
			delete this._states[time]
		})
	}
}
