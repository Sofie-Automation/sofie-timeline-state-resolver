import { DeviceType, TemplateString } from '..'
import { RefPath, MediaClipRef, SourceRef, SceneObject, UpdateSceneObject, UpdateSceneLayerObject, UpdateClipPlayerObject, RamRecorderRef, MediaRamRecRef, MediaSoundRef, MediaImageRef, MediaStillRef, SceneSnapshotRef, UpdateSceneSnapshotObject, MacroRef,  } from 'kairos-connection/dist/main'

export enum TimelineContentTypeKairos {
	SCENE = 'scene',
	SCENE_LAYER = 'scene-layer',

	// MVs? - no
	// gfx / painter - yes, to be implemented
    
	CLIP_PLAYER = 'clip-player',
	RAMREC_PLAYER = 'ramrec-player',
	STILL_PLAYER = 'still-player',
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

export interface TimelineContentKairosScene extends Partial<UpdateSceneObject> {
	type: TimelineContentTypeKairos.SCENE

	recallSnapshots: {
        // The snapshotName MUST be based on the ref (it's not really used in TSR, but should be unique)
		[snapshotName: string]: {
			/** Reference to the Snapshot */
            ref: RefPath
            /** When this is true, the Snapshot will be recalled */
            active: boolean
		} & Partial<UpdateSceneSnapshotObject>
	}
}



export interface TimelineContentKairosSceneLayer extends Partial<UpdateSceneLayerObject> {
	type: TimelineContentTypeKairos.SCENE_LAYER
}

// export interface TimelineContentKairosAux extends Partial<UpdateAuxObject> {
//     type: TimelineContentTypeKairos.AUX

//     // to be in UpdateAuxObject:
//     // source: SourceRef
// }


export interface TimelineContentKairosMacros  {
	type: TimelineContentTypeKairos.MACROS

    macros: {
        // The macroName MUST be based on the ref (it's not really used in TSR, but should be unique)
        [macroName: string]: {
            ref: RefPath
            active: MacroActiveState
        }
    }
}
export enum MacroActiveState {
    /** The Macro will be played */
    PLAYING = 'playing',
    /** The Macro will be stopped */
    STOPPED = 'stopped',
    /** No command will be sent */
    UNCHANGED = 'unchanged'
}






export interface TimelineContentKairosClipPlayer extends TimelineContentKairosPlayerBase {
    type: TimelineContentTypeKairos.CLIP_PLAYER
	/** Reference to the file to be played */
	clip: MediaClipRef
}
export interface TimelineContentKairosRamRecPlayer extends TimelineContentKairosPlayerBase {
    type: TimelineContentTypeKairos.RAMREC_PLAYER
	/** Reference to the file to be played */
	clip: MediaRamRecRef
}
export interface TimelineContentKairosStillPlayer {
    type: TimelineContentTypeKairos.STILL_PLAYER
	/** Reference to the file to be played */
	clip: MediaStillRef // and MediaImageRef?
}
export interface TimelineContentKairosSoundPlayer extends TimelineContentKairosPlayerBase {
    type: TimelineContentTypeKairos.SOUND_PLAYER
	/** Reference to the file to be played */
	clip: MediaSoundRef
}
// Note: This is quite inspired from the CasparCG Media type:
export interface TimelineContentKairosPlayerBase extends Partial<Pick<UpdateClipPlayerObject, 'colorOverwrite' |'color'>> { // clip player / ramrec player
	
	/** 
     * Whether the media file should be looping or not.
     * If this is true, the actual frame position is not guaranteed (ie seek is ignored).
     */
	repeat?: boolean

	/** The point where the file starts playing [milliseconds from start of file] */
	seek?: number
    
	/** When pausing, the unix-time the playout was paused. */
	// pauseTime?: number
    
	/** If the video is playing or is paused (defaults to true) */
	playing?: boolean

    // reverse?: boolean

	/** If true, the startTime won't be used to SEEK to the correct place in the media */
	// noStarttime?: boolean
}
