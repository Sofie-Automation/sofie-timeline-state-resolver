import type { DeviceType } from '../../index.js'

export enum TimelineContentTypeVindralComposer {
	CONNECTOR = 'connector',
	SCENE_LAYER = 'scene-layer',
	SCRIPT_ENGINE = 'script-engine',
	SWITCHER = 'switcher',
	MEDIA_PLAYER = 'media-player',
	HTML = 'html',
	AUDIO_SOURCE = 'audio-source',
}

export enum VindralComposerPlaybackEndCondition {
	Loop = 0,
	Hold = 1,
	Stop = 2,
}

export type TimelineContentVindralComposerAny =
	| TimelineContentVindralComposerConnector
	| TimelineContentVindralComposerSceneLayer
	| TimelineContentVindralComposerScriptEngine
	| TimelineContentVindralComposerSwitcher
	| TimelineContentVindralComposerMediaPlayer
	| TimelineContentVindralComposerHtml
	| TimelineContentVindralComposerAudioSource

export interface TimelineContentVindralComposerConnector {
	deviceType: DeviceType.VINDRAL_COMPOSER
	type: TimelineContentTypeVindralComposer.CONNECTOR
	connector: {
		/** Trigger the connector by name. Mutually exclusive with `value`. Required if `value` is absent. */
		name?: string
		/** Trigger the connector by value. Mutually exclusive with `name`. Required if `name` is absent. */
		value?: string
		/**
		 * Optional key/value pairs passed to the connector, accessible via `@@paramname` in Connector commands.
		 */
		params?: Record<string, string>
	}
}

export interface TimelineContentVindralComposerSceneLayer {
	deviceType: DeviceType.VINDRAL_COMPOSER
	type: TimelineContentTypeVindralComposer.SCENE_LAYER
	sceneLayer: {
		/**
		 * Name of the input source to assign to this layer.
		 * The source must already exist in the Composer Inputs list — URLs are not valid.
		 */
		source: string
	}
}

export interface TimelineContentVindralComposerScriptEngine {
	deviceType: DeviceType.VINDRAL_COMPOSER
	type: TimelineContentTypeVindralComposer.SCRIPT_ENGINE
	scriptEngine: {
		/**
		 * Optional JSON-serializable parameter object passed to the script function.
		 * The function name is defined on the mapping.
		 */
		parameter?: Record<string, unknown>
	}
}

export interface TimelineContentVindralComposerSwitcher {
	deviceType: DeviceType.VINDRAL_COMPOSER
	type: TimelineContentTypeVindralComposer.SWITCHER
	switcher: {
		/** Input name to set as the foreground (program) source */
		foregroundInputName?: string
		/** Input name to set as the background (preview) source */
		backgroundInputName?: string
		/** Duration in milliseconds for crossfade transitions */
		crossfadeTransitionDuration?: number
		/** Transition command to invoke when this object becomes active or the command type changes */
		transition?: 'cut' | 'crossfade'
	}
}

export interface TimelineContentVindralComposerMediaPlayer {
	deviceType: DeviceType.VINDRAL_COMPOSER
	type: TimelineContentTypeVindralComposer.MEDIA_PLAYER
	mediaPlayer: {
		/** URL or path of the media file to load into the player */
		sourceUrl?: string
		/** In-point within the media, in milliseconds */
		inTime?: number
		/** Out-point within the media, in milliseconds */
		outTime?: number
		/** Behaviour when playback reaches the out-point */
		playbackEndCondition?: VindralComposerPlaybackEndCondition
		/** Sets the AutoPlay device property; the device will auto-play on source change when true */
		autoPlay?: boolean
		/** When true, invokes PlayCommand; when false, invokes PauseCommand; when absent, no play/pause command is sent */
		playing?: boolean
	}
}

export interface TimelineContentVindralComposerAudioSource {
	deviceType: DeviceType.VINDRAL_COMPOSER
	type: TimelineContentTypeVindralComposer.AUDIO_SOURCE
	audioSource: {
		/** Audio level adjustment in dB (-80 to +24) applied to the stereo mix (maps to the StereoGainDb device property) */
		stereoGainDb?: number
		/** Stereo pan position (-100 to 100, maps to the Pan device property) */
		pan?: number
		/** When true, mutes the audio source (maps to the Mute device property) */
		mute?: boolean
	}
}

export interface TimelineContentVindralComposerHtml {
	deviceType: DeviceType.VINDRAL_COMPOSER
	type: TimelineContentTypeVindralComposer.HTML
	html: {
		/** URL to set as the WebPageRendererUrl property. When absent, no URL change is sent. */
		url?: string
		/** When true, invokes StartCommand; when false, invokes StopCommand; when absent, no command is sent */
		running?: boolean
		/**
		 * When this value changes (and is non-undefined), a ReloadCommand is invoked.
		 * Changing this key is the mechanism for triggering a reload without changing the URL.
		 */
		reloadKey?: string | number
	}
}
