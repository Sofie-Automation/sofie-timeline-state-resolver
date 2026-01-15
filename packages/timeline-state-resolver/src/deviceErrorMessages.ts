import { DeviceStatusError, interpolateTemplateString } from 'timeline-state-resolver-types'

/**
 * Converts structured device errors to human-readable messages using templates.
 *
 * This function is used internally by devices to populate the messages array in getStatus().
 * It can also be used by consuming applications to apply custom message templates.
 *
 * Template syntax: Use {{variable}} placeholders, which are replaced with values from error.context.
 * Unknown error codes fall back to displaying the code itself.
 *
 * @param errors - Array of DeviceStatusError objects from device.getStatus()
 * @param templates - Message templates keyed by error code. Each device exports default templates
 *                    (e.g., AtemErrorMessages). Consuming applications can provide custom templates.
 * @returns Array of interpolated message strings
 *
 * @example
 * // Device usage (internal):
 * import { AtemErrorMessages } from './errors'
 * return {
 *   statusCode: StatusCode.BAD,
 *   messages: errorsToMessages(errors, AtemErrorMessages),
 *   errors
 * }
 *
 * @example
 * // Multi-device usage:
 * import { AtemErrorMessages } from './integrations/atem'
 * import { CasparcgErrorMessages } from './integrations/casparCG'
 * const allMessages = { ...AtemErrorMessages, ...CasparcgErrorMessages }
 * const messages = errorsToMessages(errors, allMessages)
 */
export function errorsToMessages(errors: DeviceStatusError[], templates: Record<string, string> = {}): string[] {
	return errors.map((error) => {
		const template = templates[error.code] ?? error.code
		return interpolateTemplateString(template, error.context, true)
	})
}
