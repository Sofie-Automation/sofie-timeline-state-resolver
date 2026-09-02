import { DeviceType, TimelineContentTypeVindralComposer } from 'timeline-state-resolver-types'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates, diffVindralStates, makeState } from './helpers.js'

describe('diffState — switchers', () => {
	const swObj = (switcher: {
		foregroundInputName?: string
		backgroundInputName?: string
		crossfadeTransitionDuration?: number
		transition?: 'cut' | 'crossfade' | null
	}) => ({
		enable: { start: 0 },
		id: 'obj0',
		layer: 'swLayer',
		content: {
			deviceType: DeviceType.VINDRAL_COMPOSER,
			type: TimelineContentTypeVindralComposer.SWITCHER,
			switcher,
		} as const,
	})

	test('transition set → stages foreground into preview (ignoring backgroundInputName) then takes', () => {
		const commands = diffVindralStates(
			{ ...EMPTY_STATE, stateTime: 0 },
			makeState([
				swObj({
					foregroundInputName: 'cam1',
					backgroundInputName: 'cam2',
					crossfadeTransitionDuration: 500,
					transition: 'crossfade',
				}),
			]),
			MAPPINGS
		)
		// backgroundInputName 'cam2' is ignored; the desired program 'cam1' is staged into the preview
		// (BackgroundInputName) and taken to program. setProperty commands come before the take.
		expect(commands).toStrictEqual([
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: {
					type: 'set-property',
					selector: { target: 'abc-123' },
					property: 'CrossfadeTransitionDuration',
					value: 500,
				},
			},
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: {
					type: 'set-property',
					selector: { target: 'abc-123' },
					property: 'BackgroundInputName',
					value: 'cam1',
				},
			},
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: { target: 'abc-123' }, command: 'CrossfadeCommand' },
			},
		])
	})

	test('cut transition → stage foreground into preview then CutCommand', () => {
		compareStates(
			MAPPINGS,
			{ ...EMPTY_STATE, stateTime: 0 },
			makeState([swObj({ foregroundInputName: 'cam2', transition: 'cut' })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: { target: 'abc-123' },
						property: 'BackgroundInputName',
						value: 'cam2',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: { target: 'abc-123' }, command: 'CutCommand' },
				},
			]
		)
	})

	test('unchanged switcher → no commands', () => {
		const s = makeState([swObj({ foregroundInputName: 'cam1', transition: 'cut' })])
		compareStates(MAPPINGS, s, s, [])
	})

	test('foreground change with a transition → stage new foreground into preview then take', () => {
		compareStates(
			MAPPINGS,
			makeState([swObj({ foregroundInputName: 'cam1', transition: 'cut' })]),
			makeState([swObj({ foregroundInputName: 'cam3', transition: 'cut' })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: { target: 'abc-123' },
						property: 'BackgroundInputName',
						value: 'cam3',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: { target: 'abc-123' }, command: 'CutCommand' },
				},
			]
		)
	})

	test('foreground change with unchanged transition type → setProperty then transition (repeated take)', () => {
		compareStates(
			MAPPINGS,
			makeState([swObj({ foregroundInputName: 'cam2', transition: 'crossfade' })]),
			makeState([swObj({ foregroundInputName: 'cam4', transition: 'crossfade' })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: { target: 'abc-123' },
						property: 'BackgroundInputName',
						value: 'cam4',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: { target: 'abc-123' }, command: 'CrossfadeCommand' },
				},
			]
		)
	})

	test('transition: null → background set directly (no take)', () => {
		compareStates(
			MAPPINGS,
			{ ...EMPTY_STATE, stateTime: 0 },
			makeState([swObj({ backgroundInputName: 'cam2', transition: null })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: { target: 'abc-123' },
						property: 'BackgroundInputName',
						value: 'cam2',
					},
				},
			]
		)
	})

	test('switcher without transition → only setProperty commands', () => {
		compareStates(
			MAPPINGS,
			{ ...EMPTY_STATE, stateTime: 0 },
			makeState([swObj({ foregroundInputName: 'cam1', backgroundInputName: 'cam2' })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: { target: 'abc-123' },
						property: 'ForegroundInputName',
						value: 'cam1',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: { target: 'abc-123' },
						property: 'BackgroundInputName',
						value: 'cam2',
					},
				},
			]
		)
	})

	test('switcher removed → no commands', () => {
		compareStates(
			MAPPINGS,
			makeState([swObj({ foregroundInputName: 'cam1', transition: 'cut' })]),
			{ ...EMPTY_STATE, stateTime: 0 },
			[]
		)
	})
})
