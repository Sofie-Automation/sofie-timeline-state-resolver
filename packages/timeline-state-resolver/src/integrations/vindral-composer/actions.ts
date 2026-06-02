import type { VindralComposer } from 'vindral-composer-connection'
import {
	ActionExecutionResultCode,
	type VindralComposerActionMethods,
	VindralComposerActions,
} from 'timeline-state-resolver-types'
import { t } from '../../lib.js'

export function getActions(getConnection: () => VindralComposer | undefined): VindralComposerActionMethods {
	return {
		[VindralComposerActions.TriggerConnector]: async (payload) => {
			const connection = getConnection()
			if (!connection) return { result: ActionExecutionResultCode.Error, response: t('VindralComposer not connected') }
			try {
				if (payload.name !== undefined) {
					await connection.triggerConnector(payload.name, payload.params)
				} else if (payload.value !== undefined) {
					await connection.triggerConnectorByValue(payload.value, payload.params)
				} else {
					return {
						result: ActionExecutionResultCode.Error,
						response: t('Invalid trigger-connector command: missing name or value'),
					}
				}
				return { result: ActionExecutionResultCode.Ok }
			} catch (_e) {
				return { result: ActionExecutionResultCode.Error, response: t('Failed to trigger connector') }
			}
		},
		[VindralComposerActions.ExecuteScriptFunction]: async (payload) => {
			const connection = getConnection()
			if (!connection) return { result: ActionExecutionResultCode.Error, response: t('VindralComposer not connected') }
			try {
				await connection.executeScriptFunction(payload.functionName, payload.parameter)
				return { result: ActionExecutionResultCode.Ok }
			} catch (_e) {
				return { result: ActionExecutionResultCode.Error, response: t('Failed to execute script function') }
			}
		},
	}
}
