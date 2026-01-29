import { isEqual } from 'underscore'

/**
 * Iterates over top-level keys and returns an object with only the changed keys.
 * Uses deep equality comparison for each value.
 * @param oldObj
 * @param newObj
 * @returns
 */
export function diffObject<T extends object>(
	oldObj: Partial<T> | undefined,
	newObj: Partial<T> | undefined
): Partial<T> | undefined {
	if (!newObj) return undefined

	const diff: Partial<T> = {}
	let hasChange = false

	for (const key in newObj) {
		const typedKey = key as keyof T
		if (newObj[typedKey] !== undefined && !isEqual(newObj[typedKey], oldObj?.[typedKey])) {
			hasChange = true
			diff[typedKey] = newObj[typedKey]
		}
	}

	return hasChange ? diff : undefined
}

/**
 * Does a shallow comparison of two objects,
 * returning an object with booleans where any changed values will result in a `true` value.
 * @param oldObj
 * @param newObj
 * @returns
 */
export function diffObjectBoolean<T extends object>(
	oldObj: Partial<T> | undefined,
	newObj: Partial<T> | undefined
): { [P in keyof T]?: boolean } | undefined {
	if (!newObj) return undefined

	const diff: { [P in keyof T]?: boolean } = {}
	let hasChange = false

	for (const key in newObj) {
		const typedKey = key as keyof T
		if (!isEqual(newObj[key], oldObj?.[key])) {
			hasChange = true
			diff[typedKey] = true
		}
	}

	return hasChange ? diff : undefined
}

function keyIsValid(key: string, oldObj: any, newObj: any) {
	const oldVal = oldObj[key]
	const newVal = newObj[key]
	return (oldVal !== undefined && oldVal !== null) || (newVal !== undefined && newVal !== null)
}
export function getAllKeysString<V>(
	oldObj0: { [key: string]: V } | undefined,
	newObj0: { [key: string]: V } | undefined
): string[] {
	const oldObj = oldObj0 ?? {}
	const newObj = newObj0 ?? {}
	const rawKeys = Object.keys(oldObj).concat(Object.keys(newObj))
	return rawKeys.filter((v, i) => keyIsValid(v, oldObj, newObj) && rawKeys.indexOf(v) === i)
}
