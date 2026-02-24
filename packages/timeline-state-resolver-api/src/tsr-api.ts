import type { Device, DeviceContextAPI } from './device.js'

export * from './commandReport.js'
export * from './device.js'
export * from './manifest.js'
export * from './trace.js'

export { DeviceStatus, StatusCode, DeviceTimelineState, DeviceTimelineStateObject } from 'timeline-state-resolver-types'

export interface DeviceEntry {
	deviceClass: new (context: DeviceContextAPI<any, any>) => Device<any, any, any, any>
	canConnect: boolean
	deviceName: (deviceId: string, options: any) => string
	executionMode: (options: any) => 'salvo' | 'sequential'
}
