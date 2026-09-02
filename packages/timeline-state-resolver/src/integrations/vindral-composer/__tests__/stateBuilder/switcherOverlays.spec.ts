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

describe('stateBuilder — switcher overlays', () => {
	test('switcher-overlay mapping — all fields with ID selector', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { inputName: 'cam2', show: true },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.switcherOverlays['sw-123/2']).toStrictEqual({
			selector: { target: 'sw-123' },
			overlayNumber: 2,
			inputName: 'cam2',
			show: true,
			timelineObjIds: ['obj0'],
		})
		expect(result.switchers).toStrictEqual({})
	})

	test('switcher-overlay mapping — partial fields (only show)', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { show: false },
						},
					}),
				],
			},
			MAPPINGS
		)
		expect(result.switcherOverlays['sw-123/2']).toMatchObject({
			selector: { target: 'sw-123' },
			overlayNumber: 2,
			inputName: undefined,
			show: false,
		})
	})

	test('switcher-overlay mapping — name selector', () => {
		const nameOnlyMappings: Mappings<SomeMappingVindralComposer> = {
			...MAPPINGS,
			ovLayer: {
				device: DeviceType.VINDRAL_COMPOSER,
				deviceId: 'vc0',
				options: { mappingType: MappingVindralComposerType.SwitcherOverlay, switcherName: 'MySwitcher', overlay: 3 },
			},
		}
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { inputName: 'cam5', show: true },
						},
					}),
				],
			},
			nameOnlyMappings
		)
		expect(result.switcherOverlays['MySwitcher/3']).toMatchObject({
			selector: { targetName: 'MySwitcher' },
			overlayNumber: 3,
			inputName: 'cam5',
			show: true,
		})
	})

	test('switcher-overlay mapping — two different slots on same switcher get separate state keys', () => {
		const twoSlotMappings: Mappings<SomeMappingVindralComposer> = {
			...MAPPINGS,
			ovLayer2: {
				device: DeviceType.VINDRAL_COMPOSER,
				deviceId: 'vc0',
				options: { mappingType: MappingVindralComposerType.SwitcherOverlay, switcherId: 'sw-123', overlay: 4 },
			},
		}
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { inputName: 'cam1', show: true },
						},
					}),
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj1',
						layer: 'ovLayer2',
						content: {
							deviceType: DeviceType.VINDRAL_COMPOSER,
							type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
							switcherOverlay: { inputName: 'cam4', show: false },
						},
					}),
				],
			},
			twoSlotMappings
		)
		expect(result.switcherOverlays['sw-123/2']).toMatchObject({ overlayNumber: 2, inputName: 'cam1', show: true })
		expect(result.switcherOverlays['sw-123/4']).toMatchObject({ overlayNumber: 4, inputName: 'cam4', show: false })
	})

	test('switcher-overlay with wrong content type is ignored', () => {
		const result = buildVindralState(
			{
				time: 0,
				objects: [
					makeDeviceTimelineStateObject({
						enable: { start: 0 },
						id: 'obj0',
						layer: 'ovLayer',
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
		expect(result.switcherOverlays['sw-123/2']).toBeUndefined()
	})
})
