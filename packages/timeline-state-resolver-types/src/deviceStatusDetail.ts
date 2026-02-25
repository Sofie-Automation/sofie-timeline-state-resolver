/**
 * Structured device status detail for customizable status messages.
 *
 * Contains both errors and warnings about device state. "Detail" is used instead
 * of "Error" because not all status issues are true errors - for example, a
 * device disconnect is recoverable status, not a fatal error.
 *
 * Workflow:
 * 1. Device emits structured status details with code + context in getStatus()
 * 2. Device converts details to messages using default templates (for backward compatibility)
 * 3. Consuming application receives both messages and statusDetails arrays
 * 4. Application can override messages by providing custom templates
 *    (e.g., Sofie blueprints via ShowStyleBlueprintManifest, or SuperConductor via config)
 * 5. Custom templates use {{variable}} syntax, interpolated with detail context
 *
 * Status codes follow the pattern: DEVICE_{DEVICETYPE}_{STATUS}
 * Each device integration defines its own status codes as const objects.
 *
 * @example
 * // Device emits structured status detail:
 * { code: 'DEVICE_ATEM_DISCONNECTED', context: { deviceName: 'Studio ATEM', host: '192.168.1.10' } }
 *
 * // Application provides custom template:
 * deviceStatusMessages: {
 *   'DEVICE_ATEM_DISCONNECTED': '{{deviceName}} offline - check network to {{host}}'
 * }
 *
 * // Result: "Studio ATEM offline - check network to 192.168.1.10"
 */
export interface DeviceStatusDetail<
	TCode extends string = string,
	TContext extends Record<string, unknown> = Record<string, unknown>,
> {
	/** Status code - typically DEVICE_{DEVICETYPE}_{STATUS} */
	code: TCode
	/** Context for message interpolation */
	context: TContext
}
