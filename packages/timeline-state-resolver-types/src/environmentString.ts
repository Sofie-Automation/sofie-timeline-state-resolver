import type { DeviceTimelineState, TSRTimelineContent } from './index.js'

/** A string whose value is read from an environment variable. Example: "${env:API_TOKEN}" */
export type EnvironmentString = `\${env:${string}}`

export interface TimelineEnvironmentVariableReferencesContent {
	/** Resolve environment strings in this object and all of its descendants. */
	$resolveEnvironmentVariables?: true
}

const ENVIRONMENT_STRING_PATTERN = /^\$\{env:([^\s}]+)\}$/

export function dereferenceEnvironmentStringIfNeeded(value: string): string {
	const match = ENVIRONMENT_STRING_PATTERN.exec(value)
	if (!match) return value

	const environmentVariable = match[1]
	const environmentValue = process.env[environmentVariable]
	if (!environmentValue) throw new Error(`Environment variable '${environmentVariable}' not found`)

	return environmentValue
}

function dereferenceArray(value: unknown[], resolveStrings: boolean): unknown[] {
	return value.map((item) => {
		if (typeof item === 'string') return resolveStrings ? dereferenceEnvironmentStringIfNeeded(item) : item
		if (Array.isArray(item)) return dereferenceArray(item, resolveStrings)
		if (item !== null && typeof item === 'object') return dereferenceEnvironmentStrings(item, resolveStrings)
		return item
	})
}

function dereferenceEnvironmentStrings<T>(value: T, inheritedResolveStrings: boolean): T {
	if (typeof value === 'string') {
		return (inheritedResolveStrings ? dereferenceEnvironmentStringIfNeeded(value) : value) as T
	}
	if (Array.isArray(value)) {
		return dereferenceArray(value, inheritedResolveStrings) as T
	}
	if (value !== null && typeof value === 'object') {
		const object = value as Record<string, unknown>
		const resolveStrings = inheritedResolveStrings || object.$resolveEnvironmentVariables === true

		return Object.fromEntries(
			Object.entries<unknown>(object)
				.filter(([key]) => key !== '$resolveEnvironmentVariables')
				.map(([key, item]) => [key, dereferenceEnvironmentStrings(item, resolveStrings)])
		) as T
	}

	return value
}

/** Resolves environment strings in objects that opt in and propagates that opt-in to their descendants. */
export function dereferenceEnvironmentStringsIfIndicated<T>(value: T): T {
	return dereferenceEnvironmentStrings(value, false)
}

/** Returns a state with environment variable references resolved in every timeline object's content. */
export function fillStateFromEnvironment<TContent extends TSRTimelineContent>(
	state: DeviceTimelineState<TContent>
): DeviceTimelineState<TContent> {
	return {
		...state,
		objects: state.objects.map((object) => ({
			...object,
			content: dereferenceEnvironmentStringsIfIndicated(object.content),
		})),
	}
}
