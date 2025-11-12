import { MediaClipRef, MediaRamRecRef, MediaSoundRef } from 'kairos-connection'
import { TimelineObjectInstance } from 'superfly-timeline'
import { TimelineContentKairosPlayerState } from 'timeline-state-resolver-types'
import { KairosCommandWithContext } from '..'
import {
	KairosClipPlayerCommand,
	KairosRamRecPlayerCommand,
	KairosSoundPlayerCommand,
	KairosPlayerCommandMethod,
	KairosImageStoreCommand,
} from '../commands'
import { KairosDeviceState, MappingOptions } from '../stateBuilder'
import { diffObjectBoolean, getAllKeysString } from './lib'

export function diffMediaPlayers(
	stateTime: number,
	playerType: KairosClipPlayerCommand['type'] | KairosRamRecPlayerCommand['type'] | KairosSoundPlayerCommand['type'],
	oldClipPlayers: Record<number, MediaPlayerOuterState | undefined>,
	newClipPlayers: Record<number, MediaPlayerOuterState | undefined>
): KairosCommandWithContext[] {
	const commands: KairosCommandWithContext[] = []

	const playerIds = getAllKeysString(oldClipPlayers, newClipPlayers).map((v) => parseInt(v))
	for (const playerId of playerIds) {
		if (isNaN(playerId)) continue

		/** New state  */
		const newClipPlayer = newClipPlayers[playerId]
		/** Old state  */
		const oldClipPlayer = oldClipPlayers[playerId]

		const cpRef = newClipPlayer?.ref || oldClipPlayer?.ref
		if (!cpRef) continue // No ClipPlayer to diff

		/** The properties to update on the ClipPlayer */
		const updateCmd: KairosClipPlayerCommand | KairosRamRecPlayerCommand | KairosSoundPlayerCommand = {
			type: playerType,
			playerId: playerId,
			values: {},
		}

		if (!newClipPlayer && oldClipPlayer) {
			// ClipPlayer obj was removed, stop it:

			const contextTimelineObjId = oldClipPlayer?.timelineObjIds.join(' & ') ?? ''

			const clearPlayerOnStop =
				oldClipPlayer.state.content.clearPlayerOnStop ?? oldClipPlayer.state.mappingOptions.clearPlayerOnStop ?? false

			if (clearPlayerOnStop) {
				commands.push({
					timelineObjId: contextTimelineObjId,
					context: `key=${playerId} newClipPlayer=${!!newClipPlayer} oldClipPlayer=${!!oldClipPlayer}`,
					command: {
						...updateCmd,
						values: {
							clip: null, // Clear the clip
						},
					},
				})
			} else {
				commands.push({
					timelineObjId: contextTimelineObjId,
					context: `key=${playerId} newClipPlayer=${!!newClipPlayer} oldClipPlayer=${!!oldClipPlayer}`,
					command: {
						type: 'media-player:do',
						playerId: playerId,
						playerType: playerType,
						command: 'stop',
					},
				})
			}
		} else if (newClipPlayer) {
			const framerate = newClipPlayer.state.mappingOptions.framerate || 25

			const oldState = getClipPlayerState(oldClipPlayer)
			const newState = getClipPlayerState(newClipPlayer)

			const diff = diffObjectBoolean(oldState, newState)

			if (diff) {
				/** The command to be sent to the ClipPlayer */
				let playerCommand: KairosPlayerCommandMethod['command'] | null = null

				if (
					diff.absoluteStartTime &&
					newState.absoluteStartTime !== undefined &&
					oldState?.absoluteStartTime !== undefined &&
					Math.abs(newState.absoluteStartTime - oldState.absoluteStartTime) < 100
				) {
					// If the absolute seek position diff is within 100ms, ignore it:
					delete diff.absoluteStartTime
				}

				if (updateCmd.type === 'clip-player' || updateCmd.type === 'ram-rec-player') {
					// ( color and colorOverwrite only apply to clip-players and ram-rec-players )
					if (diff.color) {
						updateCmd.values.color = newState.color
					}
					if (diff.colorOverwrite) {
						updateCmd.values.colorOverwrite = newState.colorOverwrite
					}
				}
				if (diff.repeat) {
					updateCmd.values.repeat = newState.repeat ?? false
				}

				if (
					// The clip has changed, trigger a play/stop command:
					diff.clip ||
					// The seek position has changed, move the playhead:
					diff.absoluteStartTime
				) {
					// This will trigger a play command below:
					newState.playing = newState.playing ?? false
					diff.playing = true
				}

				if (diff.playing && newState.playing) {
					// Start playing the clip!

					// When starting playing, we sync the clip, position and repeat state:
					if (newState.clip !== undefined) {
						updateCmd.values.clip = newState.clip
					}
					if (newState.absoluteStartTime !== undefined) {
						const newSeek = Math.max(0, -relativeTime(stateTime, newState.absoluteStartTime))

						updateCmd.values.position = Math.floor((newSeek / 1000) * framerate)
					}
					updateCmd.values.repeat = newState.repeat ?? false

					playerCommand = 'play'
				} else if (!newState.playing) {
					// Stop the clip ( or load a paused clip )

					if (newState.seek !== undefined) {
						// Don't using the absolute time here, as we are pausing / seeking to a certain frame:
						updateCmd.values.position = Math.floor((newState.seek / 1000) * framerate)
					}
					if (newState.clip) {
						updateCmd.values.clip = newState.clip
					}
					// Stop / Pause the clip:
					if (diff.playing) playerCommand = 'pause'
				}

				if (!isEmptyObject(updateCmd.values)) {
					commands.push({
						timelineObjId: newClipPlayer?.timelineObjIds.join(' & ') ?? '',
						context: `key=${playerId} diff=${JSON.stringify(diff)}`,
						command: updateCmd,
						preliminary: playerCommand === 'play' ? 10 : 0, // Send this command a bit early if there's a Play command
					})
				}

				if (playerCommand !== null) {
					commands.push({
						timelineObjId: newClipPlayer?.timelineObjIds.join(' & ') ?? '',
						context: `key=${playerId} diff=${JSON.stringify(diff)}`,
						command: {
							type: 'media-player:do',
							playerId: playerId,
							playerType: playerType,
							command: playerCommand,
						},
					})
				}
			}
		}
	}
	return commands
}

export function diffMediaImageStore(
	oldImageStores: KairosDeviceState['imageStores'],
	newImageStores: KairosDeviceState['imageStores']
): KairosCommandWithContext[] {
	const commands: KairosCommandWithContext[] = []

	// Note: An "Image Store" would have been better named "Still Player", because it is a player that plays still images

	const playerIds = getAllKeysString(oldImageStores, newImageStores).map((v) => parseInt(v))
	for (const playerId of playerIds) {
		if (isNaN(playerId)) continue

		/** New state  */
		const newImageStore = newImageStores[playerId]
		/** Old state  */
		const oldImageStore = oldImageStores[playerId]

		const cpRef = newImageStore?.ref || oldImageStore?.ref
		if (!cpRef) continue // No ClipPlayer to diff

		if (!newImageStore && oldImageStore) {
			// ClipPlayer obj was removed, stop it:

			const clearPlayerOnStop =
				oldImageStore.state.content.imageStore.clearPlayerOnStop ??
				oldImageStore.state.mappingOptions.clearPlayerOnStop ??
				false

			if (clearPlayerOnStop) {
				commands.push({
					timelineObjId: oldImageStore?.timelineObjIds.join(' & ') ?? '',
					context: `key=${playerId} newImageStore=${!!newImageStore} oldImageStore=${!!oldImageStore}`,
					command: {
						type: 'image-store',
						playerId: playerId,
						values: {
							clip: null, // Clear the clip
						},
					},
				})
			} else {
				// Do nothing, just leave it
			}
		} else if (newImageStore) {
			/** The properties to update on the ClipPlayer */
			const updateCmd: KairosImageStoreCommand = {
				type: 'image-store',
				playerId: playerId,
				values: {},
			}

			const oldState = oldImageStore?.state.content.imageStore
			const newState = newImageStore?.state.content.imageStore

			const diff = diffObjectBoolean(oldState, newState)

			if (diff) {
				if (diff.advancedResolutionControl && newState.advancedResolutionControl !== undefined) {
					updateCmd.values.advancedResolutionControl = newState.advancedResolutionControl
				}
				if (diff.clip) {
					updateCmd.values.clip = newState.clip ?? null
				}
				if (diff.color && newState.color !== undefined) {
					updateCmd.values.color = newState.color
				}
				if (diff.colorOverwrite && newState.colorOverwrite !== undefined) {
					updateCmd.values.colorOverwrite = newState.colorOverwrite
				}
				if (diff.dissolve && newState.dissolve !== undefined) {
					updateCmd.values.dissolveEnabled = newState.dissolve.enabled ?? false
					updateCmd.values.dissolveMode = newState.dissolve.mode
					updateCmd.values.dissolveTime = newState.dissolve.duration
				}
				if (diff.removeSourceAlpha && newState.removeSourceAlpha !== undefined) {
					updateCmd.values.removeSourceAlpha = newState.removeSourceAlpha
				}
				if (diff.resolution && newState.resolution !== undefined) {
					updateCmd.values.resolution = newState.resolution
				}
				if (diff.resolutionX && newState.resolutionX !== undefined) {
					updateCmd.values.resolutionX = newState.resolutionX
				}
				if (diff.resolutionY && newState.resolutionY !== undefined) {
					updateCmd.values.resolutionY = newState.resolutionY
				}
				if (diff.scaleMode && newState.scaleMode !== undefined) {
					updateCmd.values.scaleMode = newState.scaleMode
				}

				if (!isEmptyObject(updateCmd.values)) {
					commands.push({
						timelineObjId: newImageStore?.timelineObjIds.join(' & ') ?? '',
						context: `key=${playerId} diff=${JSON.stringify(diff)}`,
						command: updateCmd,
					})
				}
			}
		}
	}
	return commands
}

type MediaPlayerAny = TimelineContentKairosPlayerState<MediaClipRef | MediaRamRecRef | MediaSoundRef>
type MediaPlayerOuterState = {
	ref: number
	state: { content: MediaPlayerAny; instance: TimelineObjectInstance; mappingOptions: MappingOptions }
	timelineObjIds: string[]
}
type MediaPlayerInnerState = MediaPlayerAny & {
	/** Unix timestamp for at what point in time the clip starts to play */
	absoluteStartTime: number | undefined
}

function isEmptyObject(obj: object | undefined): boolean {
	if (!obj) return true
	return Object.keys(obj).length === 0
}

function absoluteTime(instance: TimelineObjectInstance, relativeTime: undefined): undefined
function absoluteTime(instance: TimelineObjectInstance, relativeTime: number): number
function absoluteTime(instance: TimelineObjectInstance, relativeTime: number | undefined): number | undefined
function absoluteTime(instance: TimelineObjectInstance, relativeTime: number | undefined): number | undefined {
	if (relativeTime === undefined) return undefined
	return instance.start + relativeTime
}
function relativeTime(nowTime: number, absoluteTime: undefined): undefined
function relativeTime(nowTime: number, absoluteTime: number): number
function relativeTime(nowTime: number, absoluteTime: number | undefined): number | undefined
function relativeTime(nowTime: number, absoluteTime: number | undefined): number | undefined {
	if (absoluteTime === undefined) return undefined
	return absoluteTime - nowTime
}

function getClipPlayerState(mediaPlayer: MediaPlayerOuterState | undefined): MediaPlayerInnerState {
	if (mediaPlayer === undefined)
		return {
			absoluteStartTime: undefined,
		}

	const seek = mediaPlayer.state.content.seek
	const clipPlayerState: MediaPlayerInnerState = {
		...mediaPlayer.state.content,
		absoluteStartTime: absoluteTime(mediaPlayer.state.instance, seek !== undefined ? -seek : undefined),
	}

	if (clipPlayerState.playing === undefined) {
		clipPlayerState.playing = true // defaults to true
	}

	if (clipPlayerState.repeat === true) {
		// `.repeat` is defined as:
		// > If this is true, the actual frame position is not guaranteed (ie seek is ignored).
		delete clipPlayerState.seek
		delete clipPlayerState.absoluteStartTime
	}

	if (clipPlayerState.playing === false) {
		// If not playing, the absolute seek position is not relevant
		delete clipPlayerState.absoluteStartTime
	}

	return clipPlayerState
}
