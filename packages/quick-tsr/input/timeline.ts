import {
	DeviceType,
	TimelineContentTypeVindralComposer,
	TimelineContentVindralComposerHtml,
	TimelineContentVindralComposerMediaPlayer,
	TimelineContentVindralComposerSwitcher,
	TSRTimelineObj,
	VindralComposerPlaybackEndCondition,
} from 'timeline-state-resolver'
import { TSRInput } from '../src/index.js'
import { literal } from 'timeline-state-resolver/dist/lib'

export const input: TSRInput = {
	timeline: [
		// literal<TSRTimelineObj<TimelineContentVindralComposerConnector>>({
		// 	id: 'vindral_connector0',
		// 	enable: {
		// 		while: 1,
		// 	},
		// 	layer: 'vindralConnector0',
		// 	content: {
		// 		deviceType: DeviceType.VINDRAL_COMPOSER,
		// 		type: TimelineContentTypeVindralComposer.CONNECTOR,
		// 		connector: {
		// 			name: 'Show2',
		// 		},
		// 	},
		// }),
		// literal<TSRTimelineObj<TimelineContentVindralComposerConnector>>({
		// 	id: 'vindral_connector1',
		// 	enable: {
		// 		start: Date.now(),
		// 		duration: 2 * 1000,
		// 	},
		// 	layer: 'vindralConnector0',
		// 	content: {
		// 		deviceType: DeviceType.VINDRAL_COMPOSER,
		// 		type: TimelineContentTypeVindralComposer.CONNECTOR,
		// 		connector: {
		// 			name: 'Hide2',
		// 		},
		// 	},
		// }),

		literal<TSRTimelineObj<TimelineContentVindralComposerMediaPlayer>>({
			id: 'vindral_media_player0',
			enable: { while: 1 },
			layer: 'vMediaPlayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: {
					sourceUrl: '',
					playbackEndCondition: VindralComposerPlaybackEndCondition.Loop,
					autoPlay: true,
					playing: false,
				},
			},
		}),

		literal<TSRTimelineObj<TimelineContentVindralComposerMediaPlayer>>({
			id: 'vindral_media_player1',
			enable: { start: Date.now() + 2000 },
			layer: 'vMediaPlayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: {
					sourceUrl: 'c:/Program Files/RealSprint AB/Vindral Composer/Media/Video/SyncTest720p50.mp4',
					playbackEndCondition: VindralComposerPlaybackEndCondition.Loop,
					autoPlay: true,
					playing: true,
				},
			},
		}),
		literal<TSRTimelineObj<TimelineContentVindralComposerSwitcher>>({
			id: 'vindralscene_layer0',
			enable: {
				while: 1,
			},
			layer: 'vSwitcher',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.SWITCHER,
				switcher: {
					foregroundInputName: 'vs1',
				},
			},
		}),
		// literal<TSRTimelineObj<TimelineContentVindralComposerSwitcher>>({
		// 	id: 'vindralscene_layer1',
		// 	enable: {
		// 		start: Date.now(),
		// 		duration: 4 * 1000,
		// 	},
		// 	layer: 'vSwitcher',
		// 	content: {
		// 		deviceType: DeviceType.VINDRAL_COMPOSER,
		// 		type: TimelineContentTypeVindralComposer.SWITCHER,
		// 		switcher: {
		// 			foregroundInputName: 'in1',
		// 			transition: 'crossfade',
		// 			crossfadeTransitionDuration: 500,
		// 			// backgroundInputName: 'in2',
		// 		},
		// 	},
		// }),
		// literal<TSRTimelineObj<{ deviceType: DeviceType.VINDRAL_COMPOSER; type: TimelineContentTypeVindralComposer.SWITCHER; switcher: object }>>({
		// 	id: 'vindral_switcher0',
		// 	enable: { while: 1 },
		// 	layer: 'vSwitcher',
		// 	content: {
		// 		deviceType: DeviceType.VINDRAL_COMPOSER,
		// 		type: TimelineContentTypeVindralComposer.SWITCHER,
		// 		switcher: {
		// 			foregroundInputName: 'cam1',
		// 			backgroundInputName: 'cam2',
		// 			crossfadeTransitionDuration: 500,
		// 			transition: 'crossfade',
		// 		},
		// 	},
		// }),
		// literal<TSRTimelineObj<TimelineContentVindralComposerSceneLayer>>({
		// 	id: 'vindralscene_layer1',
		// 	enable: {
		// 		start: Date.now(),
		// 		duration: 4 * 1000,
		// 	},
		// 	layer: 'vPgmSwitcher',
		// 	content: {
		// 		deviceType: DeviceType.VINDRAL_COMPOSER,
		// 		type: TimelineContentTypeVindralComposer.SCENE_LAYER,
		// 		sceneLayer: {
		// 			source: 'in1',
		// 		},
		// 	},
		// }),

		// literal<TSRTimelineObj<TimelineContentVindralComposerScriptEngine>>({
		// 	id: 'script0',
		// 	enable: {
		// 		while: 1,
		// 	},
		// 	layer: 'vindralScriptEngine0',
		// 	content: {
		// 		deviceType: DeviceType.VINDRAL_COMPOSER,
		// 		type: TimelineContentTypeVindralComposer.SCRIPT_ENGINE,
		// 		scriptEngine: {
		// 			parameter: {
		// 				scene: 'Scene',
		// 				layer: 'BG',
		// 				isVisible: true,
		// 			},
		// 		},
		// 	},
		// }),
		// literal<TSRTimelineObj<TimelineContentVindralComposerScriptEngine>>({
		// 	id: 'script1',
		// 	enable: {
		// 		start: Date.now(),
		// 		duration: 4 * 1000,
		// 	},
		// 	layer: 'vindralScriptEngine0',
		// 	content: {
		// 		deviceType: DeviceType.VINDRAL_COMPOSER,
		// 		type: TimelineContentTypeVindralComposer.SCRIPT_ENGINE,
		// 		scriptEngine: {
		// 			parameter: {
		// 				scene: 'Scene',
		// 				layer: 'BG',
		// 				isVisible: false,
		// 			},
		// 		},
		// 	},
		// }),

		// ── HTML Renderer demo ────────────────────────────────────────────────
		// Sets the URL and starts the renderer after 2 seconds, then triggers
		// a reload by bumping the reloadKey.

		literal<TSRTimelineObj<TimelineContentVindralComposerHtml>>({
			id: 'vindral_html0',
			enable: { while: 1 },
			layer: 'vHtmlRenderer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.HTML,
				html: {
					url: 'https://google.com',
					running: true,
				},
			},
		}),

		literal<TSRTimelineObj<TimelineContentVindralComposerHtml>>({
			id: 'vindral_html1',
			enable: { start: Date.now() + 2000 },
			layer: 'vHtmlRenderer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.HTML,
				html: {
					url: 'https://google.com',
					running: true,
					reloadKey: 1,
				},
			},
		}),
	],
}
