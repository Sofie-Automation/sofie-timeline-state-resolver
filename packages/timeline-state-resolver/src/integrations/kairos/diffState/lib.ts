import { isEqual } from 'underscore'

/**
 * Does a shallow comparision of two objects, returning an object with only the changed keys.
 * @param oldObj
 * @param newObj
 * @returns
 */
export function diffObject<T>(oldObj: Partial<T> | undefined, newObj: Partial<T> | undefined): Partial<T> | undefined {
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
