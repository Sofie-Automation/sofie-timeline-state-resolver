import type { DeviceTypeExt, TSRDeviceTypesMap } from './index.js'

/**
 * A map of device types to their event types, derived from TSRDeviceTypesMap. This is used to type the events emitted by devices, to be listened on by `connectionEvent:stateEvent`
 */
export type TSREventTypesMap = {
	[K in keyof TSRDeviceTypesMap]: 'Events' extends keyof TSRDeviceTypesMap[K] ? TSRDeviceTypesMap[K]['Events'] : never
}

/**
 * A union of all event types from all known device types.
 */
export type TSREventTypes = TSREventTypesMap[keyof TSREventTypesMap]

/**
 * Represents an event emitted by a device, to be listened on by `connectionEvent:stateEvent`
 * Note: the payload can be null to indicate a return to TSR controlled state.
 */
export type TSRStateEvent<TDeviceType extends DeviceTypeExt, TEventTypes extends Record<string, unknown>> = {
	[K in keyof TEventTypes]: {
		deviceId: string // eg atem0
		deviceType: TDeviceType
		event: K // the 'shared control address', or somethins like `me-program.1`
		payload: TEventTypes[K] | null
	}
}[keyof TEventTypes]

/**
 * A union of all possible state events from all devices, to be listened on by `connectionEvent:stateEvent`
 */
export type SomeTSRStateEvent<TDevice extends DeviceTypeExt = DeviceTypeExt> = TDevice extends keyof TSREventTypesMap
	? TSREventTypesMap[TDevice] extends Record<string, unknown>
		? TSRStateEvent<TDevice, TSREventTypesMap[TDevice]>
		: never
	: never
