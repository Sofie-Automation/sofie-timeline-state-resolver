import { DeviceType, TimelineContentTypeVindralComposer } from 'timeline-state-resolver-types'
import { buildVindralState } from '../../stateBuilder.js'
import { makeDeviceTimelineStateObject } from '../../../../__mocks__/objects.js'
import { MAPPINGS } from '../lib.js'

describe('stateBuilder — switchers', () => {
	test('switcher mapping — all fields', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'swLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER,
							switcher: {
								foregroundInputName: 'cam1',
								backgroundInputName: 'cam2',
								crossfadeTransitionDuration: 500,
								transition: 'crossfade',
							},
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result).toStrictEqual({
			stateTime: 0,
			connectors: {},
			sceneLayers: {},
			scriptEngines: {},
			switchers: {
				'abc-123': {
					selector: { target: 'abc-123' },
					foregroundInputName: 'cam1',
					backgroundInputName: 'cam2',
					crossfadeTransitionDuration: 500,
					transition: 'crossfade',
					timelineObjIds: ['obj0'],
				},
			},
			switcherOverlays: {},
			mediaPlayers: {},
			htmlRenderers: {},
			audioSources: {},
		})
	})

	test('switcher mapping — partial fields', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'swLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER,
							switcher: { foregroundInputName: 'cam3' },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.switchers['abc-123']).toMatchObject({
			selector: { target: 'abc-123' },
			foregroundInputName: 'cam3',
			backgroundInputName: undefined,
			crossfadeTransitionDuration: undefined,
			transition: undefined,
		})
	})

	test('switcher mapping — transition: null is stored explicitly, clearing a prior transition', () => {
		// Unlike undefined (which falls back to the existing transition when merging), an explicit
		// null clears it — so a later object setting transition: null overrides an earlier 'cut'.
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'swLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER,
							switcher: { transition: 'cut' },
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj1',
						layer: 'swLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER,
							switcher: { transition: null },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.switchers['abc-123']?.transition).toBeNull()
	})
})
