/** This resolves to a string, where parts can be defined by the datastore */
export interface TemplateString {
	/** The string template. Example: "http://google.com?q={{searchString}}" */
	key: string
	/** Values for the arguments in the key string. Example: { searchString: "TSR" } */
	args?: Record<string, any>
}

/**
 * Interpolates {{variable}} placeholders in a translation style template string.
 * @param template - Template string with {{variable}} placeholders
 * @param context - Object with values for interpolation
 * @param leaveUnknownPlaceholders - If true, unknown placeholders are left as {{key}}.
 *                                   If false (default), braces are removed leaving just the key name.
 * @returns Interpolated string
 */
export function interpolateTemplateString(
	template: string,
	context: Record<string, any>,
	leaveUnknownPlaceholders = false
): string {
	return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
		const value = context[key]
		if (value === undefined || value === null) {
			console.log(`interpolateTemplateString: missing value for key ${key} in template:`, template)
			return leaveUnknownPlaceholders ? match : key // Keep key or placeholder if no value
		}
		return String(value)
	})
}

export function interpolateTemplateStringIfNeeded(str: string | TemplateString): string {
	if (typeof str === 'string') return str
	return interpolateTemplateString(str.key, str.args ?? {})
}
