import {
	DeviceType,
	TimelineContentTypeVindralComposer,
	VindralComposerPlaybackEndBehaviour,
} from 'timeline-state-resolver-types'
import { buildVindralState } from '../../stateBuilder.js'
import { makeDeviceTimelineStateObject } from '../../../../__mocks__/objects.js'
import { MAPPINGS } from '../lib.js'

describe('stateBuilder — media players', () => {
	test('media player mapping — all fields with ID selector', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'mpLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
							mediaPlayer: {
								sourceUrl: 'http://cdn.example.com/clip.mp4',
								inTime: 1000,
								outTime: 5000,
								endBehaviour: VindralComposerPlaybackEndBehaviour.Loop,
								playing: true,
							},
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.mediaPlayers['mpLayer']).toStrictEqual({
			selector: { target: 'player-guid', targetName: 'ClipPlayer1' },
			autoPlayOnMediaChange: true,
			sourceUrl: 'http://cdn.example.com/clip.mp4',
			inTime: 1000,
			outTime: 5000,
			endBehaviour: VindralComposerPlaybackEndBehaviour.Loop,
			playing: true,
			instanceStartTime: 0,
			timelineObjIds: ['obj0'],
		})
		expect(result.connectors).toStrictEqual({})
		expect(result.switchers).toStrictEqual({})
	})

	test('media player mapping — selector carries both target and targetName', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'mpLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
							mediaPlayer: { sourceUrl: 'http://cdn.example.com/other.mp4' },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.mediaPlayers['mpLayer']).toMatchObject({
			selector: { target: 'player-guid', targetName: 'ClipPlayer1' },
			autoPlayOnMediaChange: true,
			sourceUrl: 'http://cdn.example.com/other.mp4',
		})
	})

	test('media player with wrong content type is ignored', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'mpLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.CONNECTOR,
							connector: { name: 'cam1' },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.mediaPlayers['mpLayer']).toBeUndefined()
	})

	test('media player — lookaheadOffset is ignored for a non-lookahead object', () => {
		const obj = makeDeviceTimelineStateObject({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'mpLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: { sourceUrl: 'http://cdn.example.com/clip.mp4', inTime: 1000, outTime: 5000 },
			},
		})
		obj.lookaheadOffset = 2000

		const result = buildVindralState({ time: 0, objects: [obj] }, MAPPINGS)
		expect(result.mediaPlayers['mpLayer']).toMatchObject({ inTime: 1000, outTime: 5000 })
	})

	test('media player — lookahead object adds lookaheadOffset to inTime', () => {
		const obj = makeDeviceTimelineStateObject({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'mpLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: { sourceUrl: 'http://cdn.example.com/clip.mp4', inTime: 1000, outTime: 5000 },
			},
		})
		obj.isLookahead = true
		obj.lookaheadOffset = 2000

		const result = buildVindralState({ time: 0, objects: [obj] }, MAPPINGS)
		// inTime seeked forward by the offset, outTime unchanged
		expect(result.mediaPlayers['mpLayer']).toMatchObject({ inTime: 3000, outTime: 5000 })
	})

	test('media player — lookahead object with no content inTime falls back to lookaheadOffset', () => {
		const obj = makeDeviceTimelineStateObject({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'mpLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: { sourceUrl: 'http://cdn.example.com/clip.mp4' },
			},
		})
		obj.isLookahead = true
		obj.lookaheadOffset = 2000

		const result = buildVindralState({ time: 0, objects: [obj] }, MAPPINGS)
		expect(result.mediaPlayers['mpLayer']).toMatchObject({ inTime: 2000 })
	})

	test('media player — lookahead object without lookaheadOffset leaves inTime unchanged', () => {
		const obj = makeDeviceTimelineStateObject({
			enable: { start: 0 },
			id: 'obj0',
			layer: 'mpLayer',
			content: {
				deviceType: DeviceType.VINDRAL_COMPOSER,
				type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
				mediaPlayer: { sourceUrl: 'http://cdn.example.com/clip.mp4', inTime: 1000 },
			},
		})
		obj.isLookahead = true

		const result = buildVindralState({ time: 0, objects: [obj] }, MAPPINGS)
		expect(result.mediaPlayers['mpLayer']).toMatchObject({ inTime: 1000 })
	})
})
