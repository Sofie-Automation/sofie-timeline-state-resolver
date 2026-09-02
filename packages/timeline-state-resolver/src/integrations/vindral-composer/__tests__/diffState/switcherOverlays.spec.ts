import {
	DeviceType,
	Mappings,
	MappingVindralComposerType,
	SomeMappingVindralComposer,
	TimelineContentTypeVindralComposer,
} from 'timeline-state-resolver-types'
import { buildVindralState } from '../../stateBuilder.js'
import { makeDeviceTimelineStateObject } from '../../../../__mocks__/objects.js'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates, makeState } from './helpers.js'

describe('diffState — switcher overlays', () => {
	const OV_SELECTOR = { target: 'sw-123' }

	const ovObj = (switcherOverlay: { inputName?: string; show?: boolean }) => ({
		enable: { start: 0 },
		id: 'obj0',
		layer: 'ovLayer',
		content: {
			deviceType: DeviceType.VINDRAL_COMPOSER,
			type: TimelineContentTypeVindralComposer.SWITCHER_OVERLAY,
			switcherOverlay,
		} as const,
	})

	test('inputName appears → set-property MvOverlay2', () => {
		compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([ovObj({ inputName: 'cam2' })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'set-property', selector: OV_SELECTOR, property: 'MvOverlay2', value: 'cam2' },
			},
		])
	})

	test('inputName changed → set-property MvOverlay2', () => {
		compareStates(MAPPINGS, makeState([ovObj({ inputName: 'cam1' })]), makeState([ovObj({ inputName: 'cam2' })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'set-property', selector: OV_SELECTOR, property: 'MvOverlay2', value: 'cam2' },
			},
		])
	})

	test('inputName unchanged → no command', () => {
		const s = makeState([ovObj({ inputName: 'cam1' })])
		compareStates(MAPPINGS, s, s, [])
	})

	test('show appears true → invoke Overlay2ShowCommand', () => {
		compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([ovObj({ show: true })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2ShowCommand' },
			},
		])
	})

	test('show appears false → invoke Overlay2HideCommand', () => {
		compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([ovObj({ show: false })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2HideCommand' },
			},
		])
	})

	test('show true → false → invoke Overlay2HideCommand', () => {
		compareStates(MAPPINGS, makeState([ovObj({ show: true })]), makeState([ovObj({ show: false })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2HideCommand' },
			},
		])
	})

	test('show false → true → invoke Overlay2ShowCommand', () => {
		compareStates(MAPPINGS, makeState([ovObj({ show: false })]), makeState([ovObj({ show: true })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2ShowCommand' },
			},
		])
	})

	test('show unchanged → no command', () => {
		const s = makeState([ovObj({ show: true })])
		compareStates(MAPPINGS, s, s, [])
	})

	test('inputName + show both change → set-property emitted before invoke-command', () => {
		compareStates(
			MAPPINGS,
			makeState([ovObj({ inputName: 'cam1', show: false })]),
			makeState([ovObj({ inputName: 'cam2', show: true })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'set-property', selector: OV_SELECTOR, property: 'MvOverlay2', value: 'cam2' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay2ShowCommand' },
				},
			]
		)
	})

	test('overlay number 1 → MvOverlay1 / Overlay1ShowCommand', () => {
		const slot1Mappings: Mappings<SomeMappingVindralComposer> = {
			...MAPPINGS,
			ovLayer: {
				device: DeviceType.VINDRAL_COMPOSER,
				deviceId: 'vc0',
				options: { mappingType: MappingVindralComposerType.SwitcherOverlay, switcherId: 'sw-123', overlay: 1 },
			},
		}
		const newState = buildVindralState(
			{ time: 0, objects: [makeDeviceTimelineStateObject(ovObj({ inputName: 'cam1', show: true }))] },
			slot1Mappings
		)
		compareStates(slot1Mappings, { ...EMPTY_STATE, stateTime: 0 }, newState, [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'set-property', selector: OV_SELECTOR, property: 'MvOverlay1', value: 'cam1' },
			},
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay1ShowCommand' },
			},
		])
	})

	test('overlay number 4 → MvOverlay4 / Overlay4HideCommand', () => {
		const slot4Mappings: Mappings<SomeMappingVindralComposer> = {
			...MAPPINGS,
			ovLayer: {
				device: DeviceType.VINDRAL_COMPOSER,
				deviceId: 'vc0',
				options: { mappingType: MappingVindralComposerType.SwitcherOverlay, switcherId: 'sw-123', overlay: 4 },
			},
		}
		const newState = buildVindralState(
			{ time: 0, objects: [makeDeviceTimelineStateObject(ovObj({ show: false }))] },
			slot4Mappings
		)
		compareStates(slot4Mappings, { ...EMPTY_STATE, stateTime: 0 }, newState, [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: OV_SELECTOR, command: 'Overlay4HideCommand' },
			},
		])
	})

	test('overlay removed → no commands', () => {
		compareStates(MAPPINGS, makeState([ovObj({ inputName: 'cam1', show: true })]), { ...EMPTY_STATE, stateTime: 0 }, [])
	})
})
