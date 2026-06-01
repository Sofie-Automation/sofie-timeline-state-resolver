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
	return template.replaceAll(/\{\{(\w+)\}\}/g, (match, key) => {
		const value = context[key]
		if (value === undefined || value === null) {
			return match // Keep placeholder if value is missing
		}
		//@eslint-disable-next-line @typescript-eslint/no-base-to-string
		return String(value)
	})
}

export function interpolateTemplateStringIfNeeded(str: string | TemplateString): string {
	if (typeof str === 'string') return str
	return interpolateTemplateString(str.key, str.args ?? {})
}
