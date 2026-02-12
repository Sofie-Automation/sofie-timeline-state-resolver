import { DeviceStatusDetail } from './deviceError.js'

/** This resolves to a string, where parts can be defined by the datastore */
export interface TemplateString {
	/** The string template. Example: "http://google.com?q={{searchString}}" */
	key: string
	/** Values for the arguments in the key string. Example: { searchString: "TSR" } */
	args?: Record<string, any>
}

/**
 * Interpolates {{variable}} placeholders in a translation style template string.
 *
 * @param template - Template string with {{variable}} placeholders
 * @param context - Object with values for interpolation
 * @returns Interpolated string
 */
export function interpolateTemplateString(template: string, context: Record<string, any>): string {
	return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
		const value = context[key]
		if (value === undefined || value === null) {
			// RJM: Remove the below console.log if it is too noisy in production
			console.log(`interpolateTemplateString: missing value for key "${key}" in template:`, template)
			return match // Keep placeholder for downstream handling
		}
		return String(value)
	})
}

export function interpolateTemplateStringIfNeeded(str: string | TemplateString): string {
	if (typeof str === 'string') return str
	return interpolateTemplateString(str.key, str.args ?? {})
}

/**
 * Converts structured device status details to human-readable messages using templates.
 *
 * This function is used by:
 * - TSR devices internally to populate the messages array in getStatus()
 * - Consuming applications (Sofie, SuperConductor) to apply custom message templates
 * - Blueprints to customize status messages for operators
 *
 * Template syntax: Use {{variable}} placeholders, which are replaced with values from detail.context.
 * Unknown status codes fall back to displaying the code itself.
 * Unknown placeholders are preserved as {{key}} for downstream translation systems.
 *
 * @param statusDetails - Array of DeviceStatusDetail objects from device.getStatus()
 * @param templates - Message templates keyed by status code. Each device exports default templates
 *                    (e.g., AtemStatusMessages). Consuming applications can provide custom templates.
 * @returns Array of interpolated message strings
 *
 * @example
 * // Device usage (internal):
 * import { AtemStatusMessages } from 'timeline-state-resolver-types'
 * return {
 *   statusCode: StatusCode.BAD,
 *   messages: statusDetailsToMessages(statusDetails, AtemStatusMessages),
 *   statusDetails
 * }
 *
 * @example
 * // Multi-device usage:
 * import { AtemStatusMessages, CasparCGStatusMessages, statusDetailsToMessages } from 'timeline-state-resolver-types'
 *
 * const allMessages = { ...AtemStatusMessages, ...CasparCGStatusMessages }
 *
 * const statusDetails = [
 *   { code: 'DEVICE_ATEM_DISCONNECTED', context: { deviceName: 'Studio A Vision Mixer', host: '192.168.1.10' } },
 *   { code: 'DEVICE_ATEM_PSU_FAULT', context: { deviceName: 'Studio A Vision Mixer', host: '192.168.1.10', psuNumber: 2, totalPsus: 2 } }
 * ]
 * const messages = statusDetailsToMessages(statusDetails, allMessages)
 * // ['ATEM Studio A Vision Mixer disconnected', 'ATEM PSU 2 is faulty. The device has 2 PSU(s) in total.']
 *
 * @example
 * // Blueprint usage with custom templates:
 * import { statusDetailsToMessages, AtemStatusCode } from 'timeline-state-resolver-types'
 *
 * const customMessages = {
 *   [AtemStatusCode.DISCONNECTED]: '🎬 {{deviceName}} offline - check network!'
 * }
 * const messages = statusDetailsToMessages(statusDetails, customMessages)
 */
export function statusDetailsToMessages(
	statusDetails: DeviceStatusDetail[],
	templates: Record<string, string> = {}
): string[] {
	return statusDetails.map((detail) => {
		const template = templates[detail.code] ?? detail.code
		return interpolateTemplateString(template, detail.context)
	})
}

// Backward compatibility alias
/** @deprecated Use statusDetailsToMessages instead */
export const errorsToMessages = statusDetailsToMessages
