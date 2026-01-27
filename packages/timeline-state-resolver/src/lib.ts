import { klona } from 'klona'
import { ITranslatableMessage, ActionExecutionResultCode, ActionExecutionResult } from 'timeline-state-resolver-types'
import { PartialDeep } from 'type-fest'
import deepmerge = require('deepmerge')
import type { FinishedTrace, Trace } from 'timeline-state-resolver-api'

export function literal<T>(o: T) {
	return o
}

/** Deeply extend an object with some partial objects */
export function deepMerge<T extends object>(destination: T, source: PartialDeep<T>): T {
	return deepmerge<T>(destination, source)
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
export function set(obj: Record<string, any>, path: string, val: any) {
	try {
		const p = path.split('.')
		p.slice(0, -1).reduce((a, b) => (a[b] ? a[b] : (a[b] = {})), obj)[p.slice(-1)[0]] = val
	} catch (e) {
		// Add context:
		if (e instanceof Error) {
			e.message = `Unable to set property "${path}" of object ${JSON.stringify(obj)} to value ${JSON.stringify(
				val
			)}. Original error: ${e.message}`
		}
		throw e
	}
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
