import { klona } from 'klona'
import { ITranslatableMessage, ActionExecutionResultCode, ActionExecutionResult } from 'timeline-state-resolver-types'
import { PartialDeep } from 'type-fest'
import deepmerge = require('deepmerge')
import type { FinishedTrace, Trace } from 'timeline-state-resolver-api'

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

/** Create a Translatable message */
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
