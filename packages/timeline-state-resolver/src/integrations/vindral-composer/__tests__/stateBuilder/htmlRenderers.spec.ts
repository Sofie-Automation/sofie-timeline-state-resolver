import { DeviceType, TimelineContentTypeVindralComposer } from 'timeline-state-resolver-types'
import { buildVindralState } from '../../stateBuilder.js'
import { makeDeviceTimelineStateObject } from '../../../../__mocks__/objects.js'
import { MAPPINGS } from '../lib.js'

describe('stateBuilder — html renderers', () => {
	test('html mapping — all fields with ID selector', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'htmlLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.HTML,
							html: { url: 'https://example.com', running: true, reloadKey: 1 },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.htmlRenderers['html-guid']).toStrictEqual({
			selector: { target: 'html-guid' },
			url: 'https://example.com',
			running: true,
			reloadKey: 1,
			timelineObjIds: ['obj0'],
		})
		expect(result.connectors).toStrictEqual({})
		expect(result.mediaPlayers).toStrictEqual({})
	})

	test('html mapping — partial fields (no url)', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'htmlLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.HTML,
							html: { running: false },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.htmlRenderers['html-guid']).toMatchObject({
			selector: { target: 'html-guid' },
			url: undefined,
			running: false,
			reloadKey: undefined,
		})
	})

	test('html mapping — two objects merge (later fields win over undefined)', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'htmlLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.HTML,
							html: { url: 'https://example.com', running: true },
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj1',
						layer: 'htmlLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.HTML,
							html: { reloadKey: 42 },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.htmlRenderers['html-guid']).toStrictEqual({
			selector: { target: 'html-guid' },
			url: 'https://example.com',
			running: true,
			reloadKey: 42,
			timelineObjIds: ['obj0', 'obj1'],
		})
	})

	test('html mapping with wrong content type is ignored', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'htmlLayer',
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
		expect(result.htmlRenderers['html-guid']).toBeUndefined()
	})
})
