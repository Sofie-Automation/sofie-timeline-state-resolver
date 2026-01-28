import { DeviceType } from '../index.js'

export type TimelineContentTelemetricsAny = TimelineContentTelemetrics

export interface TimelineContentTelemetrics {
	deviceType: DeviceType.TELEMETRICS
	presetShotIdentifiers: number[]
}
