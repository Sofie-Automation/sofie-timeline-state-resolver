/**
 * Structured device error for customizable error messages.
 *
 * Workflow:
 * 1. Device emits structured errors with code + context in getStatus()
 * 2. Device converts errors to messages using default templates (for backward compatibility)
 * 3. Consuming application receives both messages and errors arrays
 * 4. Application can override messages by providing custom templates
 *    (e.g., Sofie blueprints via ShowStyleBlueprintManifest, or SuperConductor via config)
 * 5. Custom templates use {{variable}} syntax, interpolated with error context
 *
 * Error codes follow the pattern: DEVICE_{DEVICETYPE}_{ERROR}
 * Each device integration defines its own error codes as const objects.
 *
 * @example
 * // Device emits structured error:
 * { code: 'DEVICE_ATEM_DISCONNECTED', context: { deviceName: 'Studio ATEM', host: '192.168.1.10' } }
 *
 * // Application provides custom template:
 * deviceErrorMessages: {
 *   'DEVICE_ATEM_DISCONNECTED': '{{deviceName}} offline - check network to {{host}}'
 * }
 *
 * // Result: "Studio ATEM offline - check network to 192.168.1.10"
 */
export interface DeviceStatusError<
	TCode extends string = string,
	TContext extends Record<string, unknown> = Record<string, unknown>,
> {
	/** Error code - typically DEVICE_{DEVICETYPE}_{ERROR} */
	code: TCode
	/** Context for message interpolation */
	context: TContext
}
