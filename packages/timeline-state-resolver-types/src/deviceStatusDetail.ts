/**
 * Structured device status detail for customizable status messages.
 *
 * Contains both errors and warnings about device state. "Detail" is used instead
 * of "Error" because not all status issues are true errors - for example, a
 * device disconnect is recoverable status, not a fatal error.
 *
 * Workflow:
 * 1. Device creates status details using its factory function (e.g. createAtemStatusDetail).
 *    The factory pre-renders the default human-readable `message` using the device's built-in
 *    templates, and also stores the structured `code` + `context` for consumers who want to
 *    customise the message.
 * 2. Device returns `{ statusCode, statusDetails }` from getStatus().
 * 3. TSR normalises getStatus() output at the connectionChanged boundary, deriving `messages[]`
 *    from `statusDetails[].message` so downstream consumers always receive both arrays.
 * 4. Consuming applications (Sofie blueprints, SuperConductor) can re-render messages by calling
 *    interpolateTemplateString(customTemplate, detail.context) for any detail that has a code they
 *    recognise.
 *
 * Status codes follow the pattern: DEVICE_{DEVICETYPE}_{STATUS}
 * Each device integration defines its own status codes as const objects.
 *
 * @example
 * // Device creates a status detail (message is pre-rendered by the factory):
 * createAtemStatusDetail(AtemStatusCode.DISCONNECTED, { deviceName: 'Studio ATEM', host: '192.168.1.10' })
 * // → { code: 'DEVICE_ATEM_DISCONNECTED', context: { ... }, message: 'ATEM Studio ATEM disconnected' }
 *
 * // Consumer applies a custom template using the structured context:
 * interpolateTemplateString('{{deviceName}} offline - check network to {{host}}', detail.context)
 * // → "Studio ATEM offline - check network to 192.168.1.10"
 */
export interface DeviceStatusDetail<
	TCode extends string = string,
	TContext extends Record<string, unknown> = Record<string, unknown>,
> {
	/** Pre-rendered human-readable message using the device's default template. Always present. */
	message: string
	/** Status code - typically DEVICE_{DEVICETYPE}_{STATUS}. Present on structured details. */
	code?: TCode
	/** Context for custom message interpolation via interpolateTemplateString(). Present on structured details. */
	context?: TContext
}
