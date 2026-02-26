import {
	DeviceType,
	MappingKairosType,
	Mappings,
	SomeMappingKairos,
	TimelineContentTypeKairos,
} from 'timeline-state-resolver-types'
import { diffKairosStates } from '../diffState.js'
import { KairosDeviceState, KairosStateBuilder } from '../stateBuilder.js'
import { makeDeviceTimelineStateObject } from '../../../__mocks__/objects.js'
import { refIpInput } from 'kairos-connection'
import { KairosCommandWithContext } from '../commands.js'

describe('diffState', () => {
	const DEFAULT_MAPPINGS: Mappings<SomeMappingKairos> = {
		mainScene: {
			device: DeviceType.KAIROS,
			deviceId: 'kairos0',
			options: {
				mappingType: MappingKairosType.Scene,
				sceneName: ['Main'],
			},
		},
		mainSceneBackgroundLayer: {
			device: DeviceType.KAIROS,
			deviceId: 'kairos0',
			options: {
				mappingType: MappingKairosType.SceneLayer,
				sceneName: ['Main'],
				layerName: ['Background'],
			},
		},
		clipPlayer1: {
			device: DeviceType.KAIROS,
			deviceId: 'kairos0',
			options: {
				mappingType: MappingKairosType.ClipPlayer,
				playerId: 1,
			},
		},
	}
	let now = 10000
	beforeEach(() => {
		now = 10000
	})
	test('empty state to empty state', () => {
		compareStates(DEFAULT_MAPPINGS, undefined, { ...EMPTY_STATE, stateTime: 0 }, [])
	})
	test('Assign Camera1 to SceneLayer', () => {
		compareStates(
			DEFAULT_MAPPINGS,
			{ ...EMPTY_STATE, stateTime: now },
			KairosStateBuilder.fromTimeline(
				{
					objects: [
						makeDeviceTimelineStateObject({
							enable: { start: now },
							id: 'obj0',
							layer: 'mainSceneBackgroundLayer',
							content: {
								deviceType: DeviceType.KAIROS,
								type: TimelineContentTypeKairos.SCENE_LAYER,
								sceneLayer: {
									sourcePgm: refIpInput(1),
								},
							},
						}),
					],
					time: now,
				},
				DEFAULT_MAPPINGS
			),
			[
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'scene-layer',
						sceneLayerId: 'SCENES.Main.Layers.Background',
						ref: {
							realm: 'scene-layer',
							scenePath: ['Main'],
							layerPath: ['Background'],
						},
						values: {
							sourcePgm: {
								realm: 'ip-input',
								ipInput: 1,
							},
						},
					},
				},
			]
		)
	})
	describe('Clip Players', () => {
		test('Play a clip, then pause it, then resume, then clear', () => {
			let oldState = { ...EMPTY_STATE, stateTime: now }

			// Play a clip: -----------------------------------------------------------------------
			let newState = KairosStateBuilder.fromTimeline(
				{
					objects: [
						makeDeviceTimelineStateObject({
							enable: { start: now },
							id: 'obj0',
							layer: 'clipPlayer1',
							content: {
								deviceType: DeviceType.KAIROS,
								type: TimelineContentTypeKairos.CLIP_PLAYER,
								clipPlayer: {
									clip: { realm: 'media-clip', clipPath: ['amb.mp4'] },
									playing: true,
								},
							},
						}),
					],
					time: now,
				},
				DEFAULT_MAPPINGS
			)
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [
				// Preload command:
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'clip-player',
						playerId: 1,
						values: {
							clip: {
								realm: 'media-clip',
								clipPath: ['amb.mp4'],
							},
							repeat: false,
						},
					},
					preliminary: 10,
				},
				// Play command:
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'media-player:do',
						playerType: 'clip-player',
						playerId: 1,
						command: 'play',
					},
				},
			])

			// check again, when nothing has changed:
			now += 1000
			oldState = newState
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [])

			// Pause the clip ---------------------------------------------------------------------
			now += 1000
			newState = KairosStateBuilder.fromTimeline(
				{
					objects: [
						makeDeviceTimelineStateObject({
							enable: { start: now },
							id: 'obj0',
							layer: 'clipPlayer1',
							content: {
								deviceType: DeviceType.KAIROS,
								type: TimelineContentTypeKairos.CLIP_PLAYER,
								clipPlayer: {
									clip: { realm: 'media-clip', clipPath: ['amb.mp4'] },
									playing: false, // Is paused
								},
							},
						}),
					],
					time: now,
				},
				DEFAULT_MAPPINGS
			)
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'clip-player',
						playerId: 1,

						values: {
							clip: {
								realm: 'media-clip',
								clipPath: ['amb.mp4'],
							},
						},
					},
					preliminary: 0,
				},
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'media-player:do',
						playerType: 'clip-player',
						playerId: 1,
						command: 'pause',
					},
				},
			])
			// check again, when nothing has changed:
			now += 1000
			oldState = newState
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [])

			// Resume playing ---------------------------------------------------------------------
			now += 1000
			oldState = newState
			newState = KairosStateBuilder.fromTimeline(
				{
					objects: [
						makeDeviceTimelineStateObject({
							enable: { start: now },
							id: 'obj0',
							layer: 'clipPlayer1',
							content: {
								deviceType: DeviceType.KAIROS,
								type: TimelineContentTypeKairos.CLIP_PLAYER,
								clipPlayer: {
									clip: { realm: 'media-clip', clipPath: ['amb.mp4'] },
									playing: true, // Is playing
								},
							},
						}),
					],
					time: now,
				},
				DEFAULT_MAPPINGS
			)
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'clip-player',
						playerId: 1,
						values: {
							clip: {
								realm: 'media-clip',
								clipPath: ['amb.mp4'],
							},
							repeat: false,
						},
					},
					preliminary: 10,
				},
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'media-player:do',
						playerType: 'clip-player',
						playerId: 1,
						command: 'play',
					},
				},
			])
			// check again, when nothing has changed:
			now += 1000
			oldState = newState
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [])

			// Clear the clip ---------------------------------------------------------------------
			now += 1000
			oldState = newState
			newState = KairosStateBuilder.fromTimeline(
				{
					objects: [],
					time: now,
				},
				DEFAULT_MAPPINGS
			) // Empty state
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'media-player:do',
						playerType: 'clip-player',
						playerId: 1,
						command: 'stop',
					},
				},
			])
			// check again, when nothing has changed:
			now += 1000
			oldState = newState
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [])
		})
		test('Late start playing a Clip with seek', () => {
			compareStates(
				DEFAULT_MAPPINGS,
				{ ...EMPTY_STATE, stateTime: now },
				KairosStateBuilder.fromTimeline(
					{
						objects: [
							makeDeviceTimelineStateObject({
								enable: {
									// The clip was supposed to start 0.5s ago:
									start: now - 500,
								},
								id: 'obj0',
								layer: 'clipPlayer1',
								content: {
									deviceType: DeviceType.KAIROS,
									type: TimelineContentTypeKairos.CLIP_PLAYER,
									clipPlayer: {
										clip: {
											realm: 'media-clip',
											clipPath: ['amb.mp4'],
										},
										playing: true,
										seek: 100, // should start 100ms into the clip (at the point of intended start)
									},
								},
							}),
						],
						time: now,
					},
					DEFAULT_MAPPINGS
				),
				[
					// Preload command:
					{
						context: expect.any(String),
						timelineObjId: expect.any(String),
						command: {
							type: 'clip-player',
							playerId: 1,
							values: {
								clip: {
									realm: 'media-clip',
									clipPath: ['amb.mp4'],
								},
								repeat: false,
								position: (600 / 1000) * 25, // The result should be to seek 600ms into the clip (now - (500 + 100))
							},
						},
						preliminary: 10,
					},
					// Play command:
					{
						context: expect.any(String),
						timelineObjId: expect.any(String),
						command: {
							type: 'media-player:do',
							playerType: 'clip-player',
							playerId: 1,
							command: 'play',
						},
					},
				]
			)
		})
		test('Load a clip, then start playing it (with late seek)', () => {
			let oldState = { ...EMPTY_STATE, stateTime: now }

			// Load a clip: -----------------------------------------------------------------------
			let newState = KairosStateBuilder.fromTimeline(
				{
					objects: [
						makeDeviceTimelineStateObject({
							enable: {
								// We're a bit late, should not affect the outcome though:
								start: now - 500,
							},
							id: 'obj0',
							layer: 'clipPlayer1',
							content: {
								deviceType: DeviceType.KAIROS,
								type: TimelineContentTypeKairos.CLIP_PLAYER,
								clipPlayer: {
									clip: {
										realm: 'media-clip',
										clipPath: ['amb.mp4'],
									},
									playing: false,
									seek: 100, // load it 100ms into the clip
								},
							},
						}),
					],
					time: now,
				},
				DEFAULT_MAPPINGS
			)
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [
				// Preload command:
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'clip-player',
						playerId: 1,
						values: {
							clip: {
								realm: 'media-clip',
								clipPath: ['amb.mp4'],
							},
							position: Math.floor((100 / 1000) * 25),
						},
					},
					preliminary: 0,
				},
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'media-player:do',
						playerType: 'clip-player',
						playerId: 1,
						command: 'pause',
					},
				},
			])
			// check again, when nothing has changed:
			now += 1000
			oldState = newState
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [])

			// Resume playing ---------------------------------------------------------------------
			now += 1000
			oldState = newState
			newState = KairosStateBuilder.fromTimeline(
				{
					objects: [
						makeDeviceTimelineStateObject({
							enable: {
								start: now,
							},
							id: 'obj0',
							layer: 'clipPlayer1',
							content: {
								deviceType: DeviceType.KAIROS,
								type: TimelineContentTypeKairos.CLIP_PLAYER,
								clipPlayer: {
									clip: {
										realm: 'media-clip',
										clipPath: ['amb.mp4'],
									},
									playing: true,
									seek: 100,
								},
							},
						}),
					],
					time: now,
				},
				DEFAULT_MAPPINGS
			)
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'clip-player',
						playerId: 1,
						values: {
							clip: {
								realm: 'media-clip',
								clipPath: ['amb.mp4'],
							},
							repeat: false,
							position: Math.floor((100 / 1000) * 25),
						},
					},
					preliminary: 10,
				},
				{
					context: expect.any(String),
					timelineObjId: expect.any(String),
					command: {
						type: 'media-player:do',
						playerType: 'clip-player',
						playerId: 1,
						command: 'play',
					},
				},
			])
			// check again, when nothing has changed:
			now += 1000
			oldState = newState
			compareStates(DEFAULT_MAPPINGS, oldState, newState, [])
		})
	})
	// test('temporal order when cutting to/from a clip player before it has started/stopped playing', () => {

	// })
})

function compareStates(
	mappings: Mappings<SomeMappingKairos>,
	oldKairosState: KairosDeviceState | undefined,
	newKairosState: KairosDeviceState,
	expectedCommands: KairosCommandWithContext[]
) {
	const commands = diffKairosStates(oldKairosState, newKairosState, mappings)

	expect(commands).toStrictEqual(expectedCommands)
}

const EMPTY_STATE: Omit<KairosDeviceState, 'stateTime'> = {
	aux: {},
	clipPlayers: {},
	macros: {},
	ramRecPlayers: {},
	sceneLayers: {},
	sceneSnapshots: {},
	scenes: {},
	soundPlayers: {},
	imageStores: {},
}
