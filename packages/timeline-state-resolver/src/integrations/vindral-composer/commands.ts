import type { VindralComposer } from 'vindral-composer-connection'
import type { CommandWithContext } from 'timeline-state-resolver-api'
import { assertNever } from '../../lib.js'
import path from 'path'

export type VindralCommandWithContext = CommandWithContext<VindralCommandAny, string>

export type VindralCommandAny =
	| VindralTriggerConnectorCommand
	| VindralSetLayerSourceCommand
	| VindralExecuteScriptCommand
	| VindralSetPropertyCommand
	| VindralInvokeCommandCommand
	| VindralClearSourceCommand
	| VindralUpdateMediaCommand

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

/** Clear a source by target GUID via `/api/source/clear?target=<guid>`. */
export interface VindralClearSourceCommand {
	type: 'clear-source'
	target: string
}
export interface VindralUpdateMediaCommand {
	type: 'update-media'
	selector: VindralObjectSelector
	sourceUri: string
	playing: boolean | undefined
	inTime: number | undefined
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
		// case 'play-video-file-input':
		// 	if (!command.selector.targetName)
		// 		throw new Error(`Missing targetName in selector (${JSON.stringify(command.selector)})`)

		// 	await connection.playVideoFileInput(command.selector.targetName, command.sourceUri)
		// 	return
		case 'clear-source':
			await connection.clearSource(command.target)
			return
		case 'update-media': {
			if (!command.selector.targetName)
				throw new Error(`update-media-command: Missing targetName in selector (${JSON.stringify(command.selector)})`)
			if (!command.selector.target)
				throw new Error(`update-media-command: Missing target in selector (${JSON.stringify(command.selector)})`)

			let trackedMediaPlayerState: 'Stopped' | 'Playing' | 'Paused' | undefined = undefined

			const ensureStopped = async (): Promise<boolean> => {
				if (trackedMediaPlayerState === 'Stopped') return false // no need to stop again

				try {
					await connection.invokeCommand(command.selector, 'StopCommand')

					await doWaitForMessage(connection, command.selector, 'Stopped', undefined, 1000)

					trackedMediaPlayerState = 'Stopped'
					return true
				} catch (err) {
					if (`${err}`.includes('state of the target does not permit it')) {
						// ignore
						return false
					} else {
						throw err
					}
				}
			}
			let trackedMediaLoaded: boolean | undefined = undefined
			const ensureCleared = async () => {
				if (trackedMediaLoaded === false) return // no need to clear again

				try {
					if (!command.selector.target)
						throw new Error(`update-media-command: Missing target in selector (${JSON.stringify(command.selector)})`)
					await connection.clearSource(command.selector.target)
					trackedMediaLoaded = false

					await doWaitForMessage(connection, command.selector, 'Source cleared', undefined, 1000)
				} catch (err) {
					if (`${err}`.includes('state of the target does not permit it')) {
						// ignore
					} else {
						throw err
					}
				}
			}

			if (command.sourceUri === '') {
				// Simple / fast-path case, clear right away:
				await ensureStopped()
				await connection.clearSource(command.selector.target)
				return
			}

			// First, check if the value is already set
			const trackedProperties = await connection.getObjectProperties({
				target: command.selector.target,
			})

			const trackedSourceUrl = trackedProperties.SourceUrl as string | undefined
			// const trackedInTimeMs = trackedProperties.InTimeMs as number | undefined // Can't use this, it's not true
			trackedMediaPlayerState = trackedProperties.MediaPlayerState as 'Stopped' | 'Playing' | 'Paused'

			const trackedSourceUrlNormalized = typeof trackedSourceUrl === 'string' ? path.normalize(trackedSourceUrl) : ''
			const sourceUriNormalized = path.normalize(command.sourceUri)
			let mediaNeedsChange = !trackedSourceUrlNormalized.endsWith(sourceUriNormalized)

			// -----------------------------------------------------------------------------------------

			if (mediaNeedsChange && command.playing === true && command.inTime === undefined) {
				// Simple / fast-path case,  we can use the internal atomic video load:
				await connection.playVideoFileInput(command.selector.targetName, command.sourceUri)
				return
			}

			// There seems to be a bug in Composer, where we can only change the InTimeMs when we have a freshly loaded video.
			if (
				command.inTime !== undefined &&
				// we only do this if the video is NOT playing
				command.playing == false
			) {
				await ensureStopped() // Ensure it is stopped, to be able to change the media url
				await ensureCleared()
				mediaNeedsChange = true
			}

			if (mediaNeedsChange) {
				await ensureStopped() // Ensure it is stopped, to be able to change the media url

				// await ensureCleared() // Clear before loading new, so we can set inTime before loading a new
				if (command.inTime !== undefined) {
					await connection.setProperty({ ...command.selector, property: 'InTimeMs', value: command.inTime })
				}

				// Ensure settings are as we expect:
				if (trackedProperties.AutoPlay !== false)
					await connection.setProperty({ ...command.selector, property: 'AutoPlay', value: false })
				if (trackedProperties.AutoPlayOnMediaChange !== false)
					await connection.setProperty({ ...command.selector, property: 'AutoPlayOnMediaChange', value: false })
				if (trackedProperties.ShowFirstFrameWhenLoaded !== true)
					await connection.setProperty({ ...command.selector, property: 'ShowFirstFrameWhenLoaded', value: true })

				// Load the Video
				await connection.setProperty({ ...command.selector, property: 'SourceUrl', value: command.sourceUri })

				// Wait for the video to have loaded, so that other commands will work:
				await doWaitForMessage(connection, command.selector, 'Source set to', 'Media loaded', 1000)
				trackedMediaLoaded = true
			}
			if (command.inTime !== undefined) {
				// Ensure we seek to the correct frame:

				await ensureStopped() // Ensure it is stopped before seeking

				await connection.setProperty({ ...command.selector, property: 'InTimeMs', value: command.inTime })
			}
			if (command.playing === true) {
				// Start playing
				await doPlayCommand(connection, command.selector, 3)
				trackedMediaPlayerState = 'Playing'
			}

			return
		}
		default:
			assertNever(command)
	}
}

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
async function doPlayCommand(connection: VindralComposer, selector: VindralObjectSelector, retries: number) {
	for (let i = 0; i < retries; i++) {
		try {
			await connection.invokeCommand(selector, 'PlayCommand')
			return
		} catch (error) {
			const errStr = `${error}`
			if (errStr.includes('400') && errStr.includes('state of the target does not permit it')) {
				// ignore, try again
				await sleep(100 * (i + 1))
			} else throw error
		}
	}
}
async function doWaitForMessage(
	connection: VindralComposer,
	selector: VindralObjectSelector,
	startMessage: string,
	afterMessage: string | undefined,
	maxWaitTime: number
): Promise<boolean> {
	let componentLog:
		| {
				LogCache: { Message: string; DateTime: string; FormattedMessageType: string }[]
		  }
		| undefined = undefined
	const ttl = Date.now() + maxWaitTime
	while (Date.now() < ttl) {
		// Check if the media is loaded
		const reply = await connection.getObjectProperties({
			target: selector.target,
		})

		if (typeof reply === 'object' && reply !== null && !Array.isArray(reply)) {
			componentLog = reply.ComponentLog as any

			if (componentLog === undefined || !Array.isArray(componentLog.LogCache))
				throw new Error(`Invalid ComponentLog format for componentLog: ${JSON.stringify(componentLog)}`)

			// First, we find a "Source set to" log entry:
			let startIndex = -1
			for (let i = componentLog.LogCache.length - 1; i >= 0; i--) {
				const entry = componentLog.LogCache[i]
				if (!entry) break
				if (entry.Message.startsWith(startMessage)) {
					startIndex = i
					break
				}
				if (entry.Message.startsWith('Source cleared')) {
					// Should not look further
					break
				}
			}

			if (startIndex !== -1) {
				if (afterMessage === undefined) return true

				// Now, we're looking for an entry with 'Media loaded and buffered'
				for (let i = startIndex; i < componentLog.LogCache.length; i++) {
					const entry = componentLog.LogCache[i]

					if (entry.Message.startsWith(afterMessage)) {
						return true
					}
				}
			}
		}
		// wait and try again:
		await sleep(100)
	}
	throw new Error(
		`Timeout waiting for "${startMessage}", "${afterMessage}" for componentLog: ${JSON.stringify(componentLog)}`
	)
}
