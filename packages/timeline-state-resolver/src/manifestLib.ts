import type { DeviceType, TSRActionSchema } from 'timeline-state-resolver-types'
import type { TSRDevicesManifestEntry } from 'timeline-state-resolver-api'

export const stringifyActionSchema = (
	action: Omit<TSRActionSchema, 'payload' | 'result'> & { payload?: any; result?: any }
): TSRActionSchema => ({
	...action,
	payload: JSON.stringify(action.payload),
})
export const stringifyMappingSchema = (schema: any): Record<string, string> =>
	Object.fromEntries(Object.entries<any>(schema.mappings).map(([id, sch]) => [id, JSON.stringify(sch)]))

export type TSRDevicesManifest = {
	[deviceType in DeviceType]: TSRDevicesManifestEntry
}

export interface TSRManifest {
	commonOptions: string
	subdevices: TSRDevicesManifest
}
