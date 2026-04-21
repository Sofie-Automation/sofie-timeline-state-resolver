import type { DeviceTypeExt } from './index.js'
import { DeviceType } from './index.js'

export type AtemEvents = {
	[key: `me.${number}.test`]: {
		abc: string
	}
	[key: `me.${number}.another`]: {
		def: string
	}
}

export type AbstractEvents = {
	something: {
		abc: string
	}
}

// A map of the known Event types. TSR plugins can be injected here when needed
export interface TSREventTypesMap {
	[DeviceType.ABSTRACT]: AbstractEvents
	[DeviceType.ATEM]: AtemEvents
}

export type TSREventTypes = TSREventTypesMap[keyof TSREventTypesMap]

export type TSRStateEvent<TDeviceType extends DeviceTypeExt, TEventTypes extends Record<string, unknown>> = {
	[K in keyof TEventTypes]: {
		deviceId: string // eg atem0
		deviceType: TDeviceType
		eventAddress: K // the 'shared control address', or somethins like `me-program.1`  ?
		eventPayload: TEventTypes[K]
	}
}[keyof TEventTypes]

export type SomeTSRStateEvent<TDevice extends DeviceTypeExt> = TDevice extends keyof TSREventTypesMap
	? TSRStateEvent<TDevice, TSREventTypesMap[TDevice]>
	: never

export const aa: SomeTSRStateEvent<DeviceType.ATEM> = {
	deviceId: 'atem0',
	deviceType: DeviceType.ATEM,
	eventAddress: 'me.1.another',
	eventPayload: {
		abc: 'def',
	},
}

export const aab: SomeTSRStateEvent<DeviceType.ATEM> = {
	deviceId: 'atem0',
	deviceType: DeviceType.ATEM,
	eventAddress: 'me.1.test',
	eventPayload: {
		abc: 'def',
	},
}

export const evts: SomeTSRStateEvent<DeviceTypeExt>[] = [aa, aab]

for (const ev of evts) {
	if (ev.deviceType === DeviceType.ATEM) {
		if (ev.eventAddress === 'me.1.another') {
			ev.eventPayload.abc = '1' // should be string
		}
		if (ev.eventAddress === 'me.1.test') {
			ev.eventPayload.abc = '1' // should be string
		}
	}
}
