import type { DeviceType } from '..'
import type {
	RefPath,
	MediaClipRef,
	UpdateSceneObject,
	UpdateSceneLayerObject,
	UpdateClipPlayerObject,
	MediaRamRecRef,
	MediaSoundRef,
	UpdateSceneSnapshotObject,
	UpdateAuxObject,
	MediaStillRef,
	MediaImageRef,
	DissolveMode,
	UpdateImageStoreObject,
} from 'kairos-lib'

export enum TimelineContentTypeKairos {
	SCENE = 'scene',
	SCENE_LAYER = 'scene-layer',

	// MVs? - no
	// gfx / painter - yes, to be implemented

	CLIP_PLAYER = 'clip-player',
	RAMREC_PLAYER = 'ramrec-player',
	IMAGE_STORE = 'image-store',
	SOUND_PLAYER = 'sound-player',

	AUX = 'aux',
	MACROS = 'macros',
}

/*
const DELETE_IT = 'delete-it-plz-actually-not-plz-just-do-it' as const
type PartialOrNull<T> = {
    [P in keyof T]?: T[P] | typeof DELETE_IT;
};
*/

export type TimelineContentKairosAny =
	| TimelineContentKairosScene
	| TimelineContentKairosSceneLayer
	| TimelineContentKairosAux
	| TimelineContentKairosMacros
	| TimelineContentKairosClipPlayer
	| TimelineContentKairosRamRecPlayer
	| TimelineContentKairosImageStore
	| TimelineContentKairosSoundPlayer

export interface TimelineContentKairosScene {
	deviceType: DeviceType.KAIROS
	type: TimelineContentTypeKairos.SCENE

	scene: Partial<UpdateSceneObject>

	recallSnapshots: {
		// The snapshotName MUST be based on the ref (it's not really used in TSR, but should be unique)
		[snapshotName: string]: TimelineContentKairosSceneSnapshotInfo
	}
}

export interface TimelineContentKairosSceneSnapshotInfo {
	/** Reference to the Snapshot */
	ref: RefPath
	/** When this is true, the Snapshot will be recalled */
	active: boolean

	properties: Partial<UpdateSceneSnapshotObject>
}

export interface TimelineContentKairosSceneLayer {
	deviceType: DeviceType.KAIROS
	type: TimelineContentTypeKairos.SCENE_LAYER

	sceneLayer: Partial<UpdateSceneLayerObject>
}

export interface TimelineContentKairosAux {
	deviceType: DeviceType.KAIROS
	type: TimelineContentTypeKairos.AUX

	aux: Partial<UpdateAuxObject>
}

export interface TimelineContentKairosMacros {
	deviceType: DeviceType.KAIROS
	type: TimelineContentTypeKairos.MACROS

	macros: {
		// The macroName MUST be based on the ref (it's not really used in TSR, but should be unique)
		[macroName: string]: TimelineContentKairosMacroInfo
	}
}
export interface TimelineContentKairosMacroInfo {
	ref: RefPath
	active: KairosMacroActiveState
}
export enum KairosMacroActiveState {
	/** The Macro will be played */
	PLAYING = 'playing',
	/** The Macro will be stopped */
	STOPPED = 'stopped',
	/** No command will be sent */
	UNCHANGED = 'unchanged',
}

export interface TimelineContentKairosClipPlayer {
	deviceType: DeviceType.KAIROS
	type: TimelineContentTypeKairos.CLIP_PLAYER

	clipPlayer: TimelineContentKairosPlayerState<MediaClipRef>
}
export interface TimelineContentKairosRamRecPlayer {
	deviceType: DeviceType.KAIROS
	type: TimelineContentTypeKairos.RAMREC_PLAYER

	ramRecPlayer: TimelineContentKairosPlayerState<MediaRamRecRef>
}
export interface TimelineContentKairosImageStore {
	deviceType: DeviceType.KAIROS
	type: TimelineContentTypeKairos.IMAGE_STORE

	imageStore: Partial<
		Pick<
			UpdateImageStoreObject,
			| 'colorOverwrite'
			| 'color'
			| 'removeSourceAlpha'
			| 'scaleMode'
			| 'resolution'
			| 'advancedResolutionControl'
			| 'resolutionX'
			| 'resolutionY'
		>
	> & {
		/**
		 * Reference to the file to be played
		 * @example "MEDIA.clips.amb&#46;mxf"
		 */
		clip: MediaStillRef | MediaImageRef | null

		/**
		 * If set, defines if the player should Clear (to black) when the still is stopped
		 * (ie the timeline object ends), or just leave it.
		 * Defaults to the clearPlayerOnStop property of the Mapping, or false
		 */
		clearPlayerOnStop?: boolean

		dissolve?: {
			enabled?: boolean

			duration: number
			mode: DissolveMode
		}
	}
}
export interface TimelineContentKairosSoundPlayer {
	deviceType: DeviceType.KAIROS
	type: TimelineContentTypeKairos.SOUND_PLAYER

	soundPlayer: TimelineContentKairosPlayerState<MediaSoundRef>
}

// Note: This is quite inspired from the CasparCG Media type:
export interface TimelineContentKairosPlayerState<TClip> extends Partial<
	Pick<UpdateClipPlayerObject, 'colorOverwrite' | 'color'>
> {
	// clip player / ramrec player

	/**
	 * Reference to the file to be played
	 * @example "MEDIA.clips.amb&#46;mxf"
	 */
	clip?: TClip

	/**
	 * Whether the media file should be looping or not.
	 * If this is true, the actual frame position is not guaranteed (ie seek is ignored).
	 */
	repeat?: boolean

	/**
	 * The point where the file starts playing [milliseconds from start of file]
	 * If undefined, this indicates that it doesn't matter where the file starts playing.
	 * To ensure that a file starts from the beginning, set seek to 0.
	 * */
	seek?: number

	/** When pausing, the unix-time the playout was paused. */
	// pauseTime?: number

	/** If the video is playing or is paused (defaults to true) */
	playing?: boolean

	/**
	 * If set, defines if the player should Clear (to black) when the clip is stopped,
	 * or just Pause.
	 * Defaults to the clearPlayerOnStop property of the Mapping, or false
	 */
	clearPlayerOnStop?: boolean

	// reverse?: boolean

	/** If true, the startTime won't be used to SEEK to the correct place in the media */
	// noStarttime?: boolean
}
