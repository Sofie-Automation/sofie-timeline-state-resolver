import {
	MediaClipRef,
	MediaRamRecRef,
	MediaSoundRef,
	UpdateClipPlayerObject,
	UpdateRamRecPlayerObject,
	UpdateAudioPlayerObject,
} from 'kairos-connection'
import { TimelineObjectInstance } from 'superfly-timeline'
import { TimelineContentKairosPlayerState } from 'timeline-state-resolver-types'
import { KairosCommandWithContext } from '..'
import {
	KairosClipPlayerCommand,
	KairosRamRecPlayerCommand,
	KairosSoundPlayerCommand,
	KairosClipPlayerCommandMethod,
} from '../commands'
import { MappingOptions } from '../stateBuilder'
import { diffObject, getAllKeysString } from './lib'

export function diffMediaPlayers(
	stateTime: number,
	playerType: KairosClipPlayerCommand['type'] | KairosRamRecPlayerCommand['type'] | KairosSoundPlayerCommand['type'],
	oldClipPlayers: Record<number, MediaPlayerOuterState | undefined>,
	newClipPlayers: Record<number, MediaPlayerOuterState | undefined>
): KairosCommandWithContext[] {
	const commands: KairosCommandWithContext[] = []

	const keys = getAllKeysString(oldClipPlayers, newClipPlayers)
	for (const key of keys) {
		const keyNum = parseInt(key)

		const newClipPlayer = newClipPlayers[keyNum]
		const oldClipPlayer = oldClipPlayers[keyNum]

		const cpRef = newClipPlayer?.ref || oldClipPlayer?.ref
		if (!cpRef) continue // No ClipPlayer to diff

		if (!newClipPlayer && oldClipPlayer) {
			// ClipPlayer obj was removed, stop it:

			const clearPlayerOnStop = oldClipPlayer.state.mappingOptions.clearPlayerOnStop || false

			if (clearPlayerOnStop) {
				commands.push({
					timelineObjId: oldClipPlayer?.timelineObjIds.join(' & ') ?? '',
					context: `key=${key} newClipPlayer=${!!newClipPlayer} oldClipPlayer=${!!oldClipPlayer}`,
					command: {
						type: 'clip-player',
						playerId: keyNum,
						values: {
							clip: null, // Clear the clip
						},
					},
				})
			} else {
				commands.push({
					timelineObjId: oldClipPlayer?.timelineObjIds.join(' & ') ?? '',
					context: `key=${key} newClipPlayer=${!!newClipPlayer} oldClipPlayer=${!!oldClipPlayer}`,
					command: {
						type: 'clip-player:do',
						playerId: keyNum,
						command: 'stop',
					},
				})
			}
		} else if (newClipPlayer) {
			const framerate = newClipPlayer.state.mappingOptions.framerate || 25

			const oldState = getClipPlayerState(oldClipPlayer)
			const newState = getClipPlayerState(newClipPlayer)

			const diff = diffObject(oldState, newState)

			if (diff) {
				const cmd: Partial<UpdateClipPlayerObject | UpdateRamRecPlayerObject | UpdateAudioPlayerObject> = {}
				let doCommand: KairosClipPlayerCommandMethod['command'] | null = null

				if (
					diff.seekAbsolute !== undefined &&
					newState.seekAbsolute !== undefined &&
					oldState?.seekAbsolute !== undefined &&
					Math.abs(newState.seekAbsolute - oldState.seekAbsolute) < 100
				) {
					// If the absolute seek position diff is within 100ms, ignore it:
					delete diff.seekAbsolute
				}

				if (playerType === 'clip-player' || playerType === 'ram-rec-player') {
					// color and colorOverwrite only apply to clip-players and ram-rec-players

					const cmd0 = cmd as Partial<UpdateClipPlayerObject | UpdateRamRecPlayerObject>
					if (diff.color !== undefined) {
						cmd0.color = diff.color
					}
					if (diff.colorOverwrite !== undefined) {
						cmd0.colorOverwrite = diff.colorOverwrite
					}
				}
				if (diff.repeat !== undefined) {
					cmd.repeat = diff.repeat
				}

				if (
					// The clip has changed, trigger a play/stop command:
					diff.clip !== undefined ||
					// The seek position has changed, move the playhead:
					diff.seekAbsolute !== undefined
				) {
					// This will trigger a play command below:
					newState.playing = newState.playing ?? false
					diff.playing = newState.playing
				}

				if (diff.playing === true) {
					// Start playing the clip!

					// When starting playing, we sync the clip, position and repeat state:
					if (newState.clip !== undefined) {
						cmd.clip = newState.clip
					}
					if (newState.seekAbsolute !== undefined) {
						const newSeek = Math.max(0, -relativeTime(stateTime, newState.seekAbsolute))

						cmd.position = Math.floor((newSeek / 1000) * framerate)
					}
					cmd.repeat = newState.repeat ?? false

					doCommand = 'play'
				} else if (newState.playing === false) {
					// Stop the clip ( or load a paused clip )

					if (newState.seek !== undefined) {
						// Don't using the absolute time here, as we are pausing / seeking to a certain frame:
						cmd.position = Math.floor((newState.seek / 1000) * framerate)
					}
					if (newState.clip) {
						cmd.clip = newState.clip
					}
					// Stop / Pause the clip:
					if (diff.playing === false) doCommand = 'pause'
				}

				if (!isEmptyObject(cmd)) {
					commands.push({
						timelineObjId: newClipPlayer?.timelineObjIds.join(' & ') ?? '',
						context: `key=${key} diff=${JSON.stringify(diff)}`,
						command: {
							type: playerType,
							playerId: keyNum,
							values: cmd as any,
						},
						preliminary: doCommand === 'play' ? 40 : 0, // Send this command a bit early if there's a Play command
					})
				}

				if (doCommand !== null) {
					commands.push({
						timelineObjId: newClipPlayer?.timelineObjIds.join(' & ') ?? '',
						context: `key=${key} diff=${JSON.stringify(diff)}`,
						command: {
							type: 'clip-player:do',
							playerId: keyNum,
							command: doCommand,
						},
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
	seekAbsolute: number | undefined
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
			seekAbsolute: undefined,
		}

	const seek = mediaPlayer.state.content.seek
	const clipPlayerState: MediaPlayerInnerState = {
		...mediaPlayer.state.content,
		seekAbsolute: absoluteTime(mediaPlayer.state.instance, seek !== undefined ? -seek : undefined),
	}

	if (clipPlayerState.playing === undefined) {
		clipPlayerState.playing = true // defaults to true
	}

	if (clipPlayerState.repeat === true) {
		// `.repeat` is defined as:
		// > If this is true, the actual frame position is not guaranteed (ie seek is ignored).
		delete clipPlayerState.seek
		delete clipPlayerState.seekAbsolute
	}

	if (clipPlayerState.playing === false) {
		// If not playing, the absolute seek position is not relevant
		delete clipPlayerState.seekAbsolute
	}

	return clipPlayerState
}
