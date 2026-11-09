import type { VindralComposer } from 'vindral-composer-connection'
import type { CommandWithContext } from 'timeline-state-resolver-api'
import { assertNever } from '../../lib.js'
import path from 'path'
import { SEEK_FUDGE_TIME } from './constants.js'

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
	playing?: boolean
	inTime?: number
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

			let trackedState: Partial<VSObjectProperties> = {}
			let trackedStateTime: number = Date.now()

			const ensureStopped = async (): Promise<boolean> => {
				if (trackedState.MediaPlayerState === 'Stopped') return false // no need to stop again

				try {
					await connection.invokeCommand(command.selector, 'StopCommand')

					// await doWaitForMessage(connection, command.selector, 'Stopped', undefined, 1000)
					await doWaitForState(connection, command.selector, 1000, (state) => {
						if (state.MediaPlayerState !== 'Stopped')
							throw new Error(`MediaPlayerState is not 'Stopped' (is ${state.MediaPlayerState})`)
					})
					trackedState.MediaPlayerState = 'Stopped'
					return true
				} catch (err) {
					if (`${err}`.includes('state of the target does not permit it')) return false
					else throw err
				}
			}

			const ensureCleared = async () => {
				if (trackedState.MediaPlayerState === 'NoMedia') return // no need to clear again

				try {
					if (!command.selector.target)
						throw new Error(`update-media-command: Missing target in selector (${JSON.stringify(command.selector)})`)
					await connection.clearSource(command.selector.target)

					// await doWaitForMessage(connection, command.selector, 'Source cleared', undefined, 1000)
					await doWaitForState(connection, command.selector, 1000, (state) => {
						if (state.MediaPlayerState !== 'NoMedia')
							throw new Error(`MediaPlayerState is not 'NoMedia' (is ${state.MediaPlayerState})`)
					})
					trackedState.MediaPlayerState = 'NoMedia'
				} catch (err) {
					if (!`${err}`.includes('state of the target does not permit it')) throw err
				}
			}

			if (command.sourceUri === '') {
				// Fast-path; clear right away:
				await ensureStopped()
				await connection.clearSource(command.selector.target)
				return
			}

			// First, check if the value is already set
			trackedState = (await connection.getObjectProperties({
				target: command.selector.target,
			})) as unknown as VSObjectProperties
			trackedStateTime = Date.now()

			const trackedSourceUrlNormalized =
				typeof trackedState.SourceUrl === 'string' ? path.normalize(trackedState.SourceUrl) : ''
			const sourceUriNormalized = path.normalize(command.sourceUri)
			let mediaNeedsChange = !trackedSourceUrlNormalized.endsWith(sourceUriNormalized)

			// -----------------------------------------------------------------------------------------

			if (mediaNeedsChange && command.playing === true && command.inTime === undefined) {
				// Simple / fast-path case,  we can use the internal atomic video load:
				await connection.playVideoFileInput(command.selector.targetName, command.sourceUri)
				return
			}

			if (
				command.inTime !== undefined &&
				// we only do this if the video is NOT playing
				command.playing == false
			) {
				// There is a limitation in Composer, we can only change the InTimeMs when we have a freshly loaded video.

				await ensureStopped() // Ensure it is stopped, to be able to change the media url
				await ensureCleared()
				mediaNeedsChange = true
			}

			if (mediaNeedsChange) {
				await ensureStopped() // Ensure it is stopped, to be able to change the media url

				if (command.inTime !== undefined && command.inTime > 0) {
					await connection.setProperty({ ...command.selector, property: 'InTimeMs', value: command.inTime })
				}

				// Ensure settings are as we expect:
				if (trackedState.AutoPlay !== false) {
					await connection.setProperty({ ...command.selector, property: 'AutoPlay', value: false })
					trackedState.AutoPlay = false
				}
				if (trackedState.AutoPlayOnMediaChange !== false) {
					await connection.setProperty({ ...command.selector, property: 'AutoPlayOnMediaChange', value: false })
					trackedState.AutoPlayOnMediaChange = false
				}
				if (trackedState.ShowFirstFrameWhenLoaded !== true) {
					await connection.setProperty({ ...command.selector, property: 'ShowFirstFrameWhenLoaded', value: true })
					trackedState.ShowFirstFrameWhenLoaded = true
				}

				// Load the Video
				await connection.setProperty({ ...command.selector, property: 'SourceUrl', value: command.sourceUri })

				// Wait for the video to have loaded, so that other commands will work:
				// await doWaitForMessage(connection, command.selector, 'Source set to', 'Media loaded', 1000)
				await doWaitForState(connection, command.selector, 1000, (state) => {
					if (state.MediaPlayerState !== 'Stopped')
						throw new Error(`MediaPlayerState is not 'Stopped' (is ${state.MediaPlayerState})`)
				})
				trackedState.SourceUrl = command.sourceUri
				trackedState.MediaPlayerState = 'Stopped'
			}
			if (command.inTime !== undefined) {
				// Ensure we seek to the correct frame:

				let doSeek = false

				if (command.playing && trackedState.MediaPlayerState === 'Playing') {
					// We'll only interrupt a playing media to SEEK if the playhead is very off:
					const currentTime = getCurrentTime(trackedState, trackedStateTime)
					if (Math.abs(command.inTime - currentTime) > SEEK_FUDGE_TIME) {
						doSeek = true
					}
				} else {
					doSeek = true
				}
				if (doSeek) {
					const didStop = await ensureStopped() // Ensure it is stopped before seeking

					const currentTime = getCurrentTime(trackedState, trackedStateTime)
					if (didStop || currentTime !== command.inTime || trackedState.InTimeMs !== command.inTime) {
						await connection.setProperty({ ...command.selector, property: 'InTimeMs', value: command.inTime })
					}
				}
			}
			if (command.playing === true) {
				// Start playing
				await doPlayCommand(connection, command.selector, 3)
				trackedState.MediaPlayerState = 'Playing'
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
async function doWaitForState(
	connection: VindralComposer,
	selector: VindralObjectSelector,
	maxWaitTime: number,
	/** Throws if the state does not satisfy the condition */
	fn: (state: VSObjectProperties) => void
): Promise<boolean> {
	const ttl = Date.now() + maxWaitTime
	let lastError: Error | undefined = undefined
	while (Date.now() < ttl) {
		// Check if the media is loaded
		const state = (await connection.getObjectProperties(selector)) as unknown as VSObjectProperties

		if (typeof state === 'object' && state !== null && !Array.isArray(state)) {
			try {
				fn(state)
				return true
			} catch (e) {
				lastError = e as Error
			}
		}
		// wait and try again:
		await sleep(100)
	}
	throw new Error(`Timeout waiting for state to satisfy condition: ${lastError?.message ?? 'unknown error'}`)
}

interface VSObjectProperties {
	MediaPlayerState: 'Stopped' | 'Playing' | 'Paused' | 'NoMedia'
	SourceUrl: string
	CurrentTimeMs: number
	InTimeMs: number
	AutoPlayOnMediaChange: boolean
	ShowFirstFrameWhenLoaded: boolean
	AutoPlay: boolean
}
function getCurrentTime(trackedState: Partial<VSObjectProperties>, trackedStateTime: number): number {
	const elapsed = trackedState.MediaPlayerState === 'Playing' ? Date.now() - trackedStateTime : 0
	return (trackedState.CurrentTimeMs ?? 0) + elapsed
}
