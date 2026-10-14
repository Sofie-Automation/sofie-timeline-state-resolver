import { TimelineContentVindralComposerMediaPlayer } from 'timeline-state-resolver-types'

/**
 * Resolve the InTime to send for a media player. A clip that is playing is advanced by how
 * long its timeline object has already been live (now - instance start), so a clip started
 * partway through resumes from the correct position rather than restarting at its in-point.
 * A paused/loading clip sits at its raw in-point. Lookahead objects have a future start, so
 * the elapsed term is 0 and only the (already folded in) lookahead offset applies.
 */
export function resolveSeekTime(
	stateTime: number,
	instanceStartTime: number,
	mp: Pick<TimelineContentVindralComposerMediaPlayer['mediaPlayer'], 'inTime' | 'playing'>
): number | undefined {
	if (mp.inTime === undefined) return undefined

	const timeSinceStart = Math.max(0, stateTime - instanceStartTime)
	const elapsed = mp.playing === true ? timeSinceStart : 0

	const seekTime = mp.inTime + elapsed

	if (mp.playing === true && seekTime < 300) return 0 // when playing, we treat small seek times as 0 to avoid jitter at the start of playback.

	return seekTime
}
