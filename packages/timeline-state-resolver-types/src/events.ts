import type { DeviceTypeExt, TSRDeviceTypesMap } from './index.js'

// Derived from TSRDeviceTypesMap - automatically includes any device that has an Events property
export type TSREventTypesMap = {
	[K in keyof TSRDeviceTypesMap]: 'Events' extends keyof TSRDeviceTypesMap[K] ? TSRDeviceTypesMap[K]['Events'] : never
}

export type TSREventTypes = TSREventTypesMap[keyof TSREventTypesMap]

export type TSRStateEvent<TDeviceType extends DeviceTypeExt, TEventTypes extends Record<string, unknown>> = {
	[K in keyof TEventTypes]: {
		deviceId: string // eg atem0
		deviceType: TDeviceType
		event: K // the 'shared control address', or somethins like `me-program.1`
		payload: TEventTypes[K] | null
	}
}[keyof TEventTypes]

export type SomeTSRStateEvent<TDevice extends DeviceTypeExt = DeviceTypeExt> = TDevice extends keyof TSREventTypesMap
	? TSREventTypesMap[TDevice] extends Record<string, unknown>
		? TSRStateEvent<TDevice, TSREventTypesMap[TDevice]>
		: never
	: never
