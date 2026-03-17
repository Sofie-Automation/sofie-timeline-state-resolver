/* eslint-disable */

/**
 * Extract translation keys from a JSON schema file.
 * Returns an array of key strings.
 */
export function extractKeysFromJson(content, filename) {
	const keys = []

	try {
		const obj = JSON.parse(content)

		// The root could be an object in places without a meta-schema (eg options)
		processObject(keys, obj)

		// actions are nested
		if ('actions' in obj) {
			obj.actions.forEach((action) => {
				action.name && keys.push(action.name)
				processObject(keys, action.payload)
			})
		}

		// mappings are nested
		if ('mappings' in obj) {
			Object.values(obj.mappings).forEach((mapping) => {
				processObject(keys, mapping)
			})
		}
	} catch (e) {
		console.error(`File "${filename}" contains invalid json`)
	}

	return keys
}

function processObject(keys, obj) {
	if (!obj) return

	if (obj['ui:title']) keys.push(obj['ui:title'])
	if (obj['ui:summaryTitle']) keys.push(obj['ui:summaryTitle'])
	if (obj['ui:description']) keys.push(obj['ui:description'])

	if (obj.type === 'array') {
		processObject(keys, obj.items)
	} else if (obj.type === 'object') {
		for (const prop of Object.values(obj.properties || {})) {
			processObject(keys, prop)
		}
	}
}
