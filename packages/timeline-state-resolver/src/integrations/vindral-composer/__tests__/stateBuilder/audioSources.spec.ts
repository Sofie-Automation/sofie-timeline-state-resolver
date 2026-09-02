import {
	DeviceType,
	Mappings,
	MappingVindralComposerType,
	SomeMappingVindralComposer,
	TimelineContentTypeVindralComposer,
} from 'timeline-state-resolver-types'
import { buildVindralState } from '../../stateBuilder.js'
import { makeDeviceTimelineStateObject } from '../../../../__mocks__/objects.js'
import { MAPPINGS } from '../lib.js'

describe('stateBuilder — audio sources', () => {
	test('audio-source mapping — all fields with ID selector', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'asLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.AUDIO_SOURCE,
							audioSource: { stereoGainDb: -6, pan: 50, mute: false },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.audioSources['as-guid']).toStrictEqual({
			selector: { target: 'as-guid' },
			stereoGainDb: -6,
			pan: 50,
			mute: false,
			timelineObjIds: ['obj0'],
		})
		expect(result.mediaPlayers).toStrictEqual({})
	})

	test('audio-source mapping — selector falls back to name when no ID', () => {
		const nameOnlyMappings: Mappings<SomeMappingVindralComposer> = {
			...MAPPINGS,
			asLayer: {
				device: DeviceType.VINDRAL_COMPOSER,
				deviceId: 'vc0',
				options: {
					mappingType: MappingVindralComposerType.AudioSource,
					audioSourceName: 'AudioSource1',
				},
			},
		}
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'asLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.AUDIO_SOURCE,
							audioSource: { mute: true },
						},
					}),
				],
			},
			nameOnlyMappings
		)
		expect(result.audioSources['AudioSource1']).toMatchObject({
			selector: { targetName: 'AudioSource1' },
			mute: true,
		})
	})

	test('audio-source mapping — two objects merge (later fields win over undefined)', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'asLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.AUDIO_SOURCE,
							audioSource: { stereoGainDb: -6, pan: 50 },
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj1',
						layer: 'asLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.AUDIO_SOURCE,
							audioSource: { mute: true },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.audioSources['as-guid']).toStrictEqual({
			selector: { target: 'as-guid' },
			stereoGainDb: -6,
			pan: 50,
			mute: true,
			timelineObjIds: ['obj0', 'obj1'],
		})
	})

	test('audio-source with wrong content type is ignored', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'asLayer',
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
		expect(result.audioSources['as-guid']).toBeUndefined()
	})
})
