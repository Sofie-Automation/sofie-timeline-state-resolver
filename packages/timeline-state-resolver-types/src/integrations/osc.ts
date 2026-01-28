import { DeviceType } from '../generated/index.js'
import { DeviceStatusError } from '../deviceError.js'

/**
 * Error codes for OSC device issues.
 * These codes can be customized in blueprints via deviceErrorMessages.
 */
export const OSCErrorCode = {
	TCP_DISCONNECTED: 'DEVICE_OSC_TCP_DISCONNECTED',
} as const

export type OSCErrorCode = (typeof OSCErrorCode)[keyof typeof OSCErrorCode]

/**
 * Context data for each OSC error type.
 * These fields are available for message template interpolation.
 */
export interface OSCErrorContextMap {
	[OSCErrorCode.TCP_DISCONNECTED]: {
		deviceName: string
		host: string
		port: number
	}
}

export type OSCError<T extends OSCErrorCode = OSCErrorCode> = DeviceStatusError<T, OSCErrorContextMap[T]>

/**
 * Default error message templates for OSC devices.
 * Can be overridden in blueprints via deviceErrorMessages.
 */
export const OSCErrorMessages: Record<OSCErrorCode, string> = {
	[OSCErrorCode.TCP_DISCONNECTED]: 'Disconnected',
}

// Note: This type is a loose referral to (a copy of) keyof typeof Easing in '../../easings', so that Easing structure won't be included in the types package
export type OSCEasingType =
	| 'Linear'
	| 'Quadratic'
	| 'Cubic'
	| 'Quartic'
	| 'Quintic'
	| 'Sinusoidal'
	| 'Exponential'
	| 'Circular'
	| 'Elastic'
	| 'Back'
	| 'Bounce'

export enum TimelineContentTypeOSC {
	OSC = 'osc',
}

export enum OSCValueType {
	INT = 'i',
	FLOAT = 'f',
	STRING = 's',
	BLOB = 'b',
	TRUE = 'T',
	FALSE = 'F',
}

export interface OSCValueNumber {
	type: OSCValueType.INT | OSCValueType.FLOAT
	value: number
}
export interface OSCValueString {
	type: OSCValueType.STRING
	value: string
}
export interface OSCValueBlob {
	type: OSCValueType.BLOB
	value: Uint8Array
}
export interface OSCValueBoolean {
	type: OSCValueType.TRUE | OSCValueType.FALSE
	value: void
}
export type SomeOSCValue = OSCValueNumber | OSCValueString | OSCValueBlob | OSCValueBoolean

export interface OSCMessageCommandContent {
	type: TimelineContentTypeOSC.OSC
	path: string
	values: SomeOSCValue[]
	transition?: {
		duration: number
		type: OSCEasingType
		direction: 'In' | 'Out' | 'InOut' | 'None'
	}
	from?: SomeOSCValue[]
}
export type TimelineContentOSCAny = TimelineContentOSCMessage

export interface TimelineContentOSC {
	deviceType: DeviceType.OSC
	type: TimelineContentTypeOSC
}
export type TimelineContentOSCMessage = TimelineContentOSC & OSCMessageCommandContent
