import { klona } from 'klona'
import {
	Datastore,
	Timeline,
	TimelineDatastoreReferencesContent,
	TSRTimelineContent,
	ITranslatableMessage,
	ActionExecutionResultCode,
	TimelineDatastoreReferences,
	ActionExecutionResult,
	TemplateString,
} from 'timeline-state-resolver-types'
import { PartialDeep } from 'type-fest'
import deepmerge from 'deepmerge'

export function literal<T>(o: T) {
	return o
}
/**
 * Make all optional properties be required and `| undefined`
 * This is useful to ensure that no property is missed, when manually converting between types, but allowing fields to be undefined
 */
export type Complete<T> = {
	[P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined
}

/** Deeply extend an object with some partial objects */
export function deepMerge<T extends object>(destination: T, source: PartialDeep<T>): T {
	return deepmerge<T>(destination, source)
}

export interface Trace {
	/** id of this trace, should be formatted as namespace:id */
	measurement: string
	/** timestamp of when trace was started */
	start: number
	/** Tags to differentiate data sources */
	tags?: Record<string, string>
}
export interface FinishedTrace extends Trace {
	/** timestamp of when trace was ended */
	ended: number
	/** duration of the trace */
	duration: number
}

export function startTrace(measurement: string, tags?: Record<string, string>): Trace {
	return {
		measurement,
		tags,
		start: Date.now(),
	}
}

export function endTrace(trace: Trace): FinishedTrace {
	return {
		...trace,
		ended: Date.now(),
		duration: Date.now() - trace.start,
	}
}

/**
 * 'Defer' the execution of an async function.
 * Pass an async function, and a catch block
 */
export function deferAsync(fn: () => Promise<void>, catcher: (e: unknown) => void): void {
	fn().catch(catcher)
}

/**
 * Set a value on an object from a .-delimited path
 * @param obj The base object
 * @param path Path of the value to set
 * @param val The value to set
 */
const set = (obj: Record<string, any>, path: string, val: any) => {
	const p = path.split('.')
	p.slice(0, -1).reduce((a, b) => (a[b] ? a[b] : (a[b] = {})), obj)[p.slice(-1)[0]] = val
}
export function fillStateFromDatastore(state: Timeline.TimelineState<TSRTimelineContent>, datastore: Datastore) {
	// clone the state so we can freely manipulate it
	const filledState: typeof state = JSON.parse(JSON.stringify(state))

	Object.values<Timeline.ResolvedTimelineObjectInstance<TSRTimelineContent>>(filledState.layers).forEach(
		({ content, instance }) => {
			if ((content as TimelineDatastoreReferencesContent).$references) {
				Object.entries<TimelineDatastoreReferences[0]>(
					(content as TimelineDatastoreReferencesContent).$references || {}
				).forEach(([path, ref]) => {
					const datastoreVal = datastore[ref.datastoreKey]

					if (datastoreVal !== undefined) {
						if (ref.overwrite) {
							// only use the datastore value if it was changed after the tl obj started
							if ((instance.originalStart || instance.start || 0) <= datastoreVal.modified) {
								set(content, path, datastoreVal.value)
							}
						} else {
							set(content, path, datastoreVal.value)
						}
					}
				})
			}
		}
	)

	return filledState
}

export function t(key: string, args?: { [k: string]: any }): ITranslatableMessage {
	return {
		key,
		args,
	}
}

export function generateTranslation(key: string): string {
	return key
}

export function assertNever(_never: never): void {
	// Do nothing. This is a type guard
}

export function actionNotFoundMessage(id: never): ActionExecutionResult<any> {
	// Note: (id: never) is an assertNever(actionId)

	return {
		result: ActionExecutionResultCode.Error,
		response: t('Action "{{id}}" not found', { id }),
	}
}

export function cloneDeep<T>(input: T): T {
	return klona(input)
}

/**
 * Interpolate a translation style string
 */
export function interpolateTemplateString(key: string, args: { [key: string]: any } | undefined): string {
	if (!args || typeof key !== 'string') {
		return String(key)
	}

	let interpolated = String(key)
	for (const placeholder of key.match(/[^{}]+(?=})/g) || []) {
		const value = args[placeholder] || placeholder
		interpolated = interpolated.replace(`{{${placeholder}}}`, value)
	}

	return interpolated
}

export function interpolateTemplateStringIfNeeded(str: string | TemplateString): string {
	if (typeof str === 'string') return str
	return interpolateTemplateString(str.key, str.args)
}
