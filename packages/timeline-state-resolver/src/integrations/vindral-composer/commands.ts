import type { VindralComposer } from 'vindral-composer-connection'
import type { CommandWithContext } from 'timeline-state-resolver-api'
import { assertNever } from '../../lib.js'

export type VindralCommandWithContext = CommandWithContext<VindralCommandAny, string>

export type VindralCommandAny =
	| VindralTriggerConnectorCommand
	| VindralSetLayerSourceCommand
	| VindralExecuteScriptCommand
	| VindralSetPropertyCommand
	| VindralInvokeCommandCommand
	| VindralPlayVideoFileInputCommand

export interface VindralTriggerConnectorCommand {
	type: 'trigger-connector'
	name?: string
	value?: string
	params?: Record<string, string>
}

export interface VindralSetLayerSourceCommand {
	type: 'set-layer-source'
	scene: string
	layer: string
	source: string
}

export interface VindralExecuteScriptCommand {
	type: 'execute-script'
	functionName: string
	parameter?: Record<string, unknown>
}

export interface VindralObjectSelector {
	target?: string
	targetName?: string
	targetType?: string
}

export interface VindralSetPropertyCommand {
	type: 'set-property'
	selector: VindralObjectSelector
	property: string
	value: string | number | boolean
}

export interface VindralInvokeCommandCommand {
	type: 'invoke-command'
	selector: VindralObjectSelector
	command: string
}

/** Atomic load-and-play via the dedicated endpoint — handles clip-load timing internally. */
export interface VindralPlayVideoFileInputCommand {
	type: 'play-video-file-input'
	inputName: string
	sourceUri: string
}

export async function sendCommand(connection: VindralComposer, command: VindralCommandAny): Promise<void> {
	switch (command.type) {
		case 'trigger-connector':
			if (command.name !== undefined) {
				await connection.triggerConnector(command.name, command.params)
			} else if (command.value !== undefined) {
				await connection.triggerConnectorByValue(command.value, command.params)
			} else {
				throw new Error('Invalid trigger-connector command: missing name or value')
			}
			return
		case 'set-layer-source':
			await connection.setLayerSource(command.scene, command.layer, command.source)
			return
		case 'execute-script':
			await connection.executeScriptFunction(command.functionName, command.parameter)
			return
		case 'set-property':
			await connection.setProperty({ ...command.selector, property: command.property, value: command.value })
			return
		case 'invoke-command':
			await connection.invokeCommand(command.selector, command.command)
			return
		case 'play-video-file-input':
			await connection.playVideoFileInput(command.inputName, command.sourceUri)
			return
		default:
			assertNever(command)
	}
}
