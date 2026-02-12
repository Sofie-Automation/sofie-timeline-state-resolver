import {
	DeviceType,
	Mapping,
	MappingVmixType,
	SomeMappingVmix,
	Timeline,
	TimelineContentTypeVMix,
	TimelineContentVMixAny,
	TSRTimelineContent,
	VMixInputType,
	VMixTransitionType,
} from 'timeline-state-resolver-types'
import { DeviceTimelineState, DeviceTimelineStateObject } from 'timeline-state-resolver-api'
import { VMixTimelineStateConverter } from '../vMixTimelineStateConverter'
import { VMixOutput, VMixStateDiffer } from '../vMixStateDiffer'
import { prefixAddedInput } from './mockState'

function createTestee(): VMixTimelineStateConverter {
	const stateDiffer = new VMixStateDiffer(
		() => Date.now(),
		() => {
			//
		}
	) // should those be mocks? or should this be taken from somewhere else? this is now more of an integration test, and maybe that's fine?
	return new VMixTimelineStateConverter(stateDiffer)
}

function wrapInTimelineState(
	layers: Record<string, TimelineContentVMixAny | DeviceTimelineStateObject<TimelineContentVMixAny>>
): DeviceTimelineState<TSRTimelineContent> {
	return {
		time: Date.now(),
		objects: Object.entries<TimelineContentVMixAny | DeviceTimelineStateObject<TimelineContentVMixAny>>(layers).map(
			([layer, o]) => {
				if ('content' in o) {
					return o
				}
				return wrapInTimelineObject(layer, o)
			}
		),
	}
}

function wrapInTimelineObject(
	layer: string,
	content: TimelineContentVMixAny,
	props?: Partial<DeviceTimelineStateObject<TimelineContentVMixAny>>
): DeviceTimelineStateObject<TimelineContentVMixAny> {
	return {
		id: '',
		enable: { while: '1' },
		priority: 1,
		content,
		layer,
		instance: { id: '@0', start: 0, end: null, references: [] } as Timeline.TimelineObjectInstance,
		...props,
	} as DeviceTimelineStateObject<TimelineContentVMixAny>
}

function wrapInMapping(options: SomeMappingVmix): Mapping<SomeMappingVmix> {
	return {
		device: DeviceType.VMIX,
		deviceId: 'vmix0',
		options,
	}
}

/**
 * Note: most of the coverage is still in vmix.spec.ts
 */
describe('VMixTimelineStateConverter', () => {
	it('does not track state for outputs when not mapped', () => {
		const converter = createTestee()

		const result = converter.getVMixStateFromTimelineState(wrapInTimelineState({}), {})
		const controlledOutputs = Object.values<VMixOutput | undefined>({ ...result.outputs }).filter(
			(output) => output !== undefined
		)
		expect(controlledOutputs.length).toBe(0)
	})

	describe('inputs', () => {
		it('does not track state for not mapped existing inputs', () => {
			const converter = createTestee()

			const result = converter.getVMixStateFromTimelineState(wrapInTimelineState({}), {})
			expect(Object.keys(result.reportedState.existingInputs).length).toBe(0)
			expect(Object.keys(result.reportedState.existingInputsAudio).length).toBe(0)
		})

		it('does not track state for not mapped inputs added by us', () => {
			const converter = createTestee()

			const result = converter.getVMixStateFromTimelineState(wrapInTimelineState({}), {})
			expect(Object.keys(result.reportedState.inputsAddedByUs).length).toBe(0)
			expect(Object.keys(result.reportedState.inputsAddedByUsAudio).length).toBe(0)
		})

		it('tracks state for mapped existing inputs', () => {
			const converter = createTestee()

			const result = converter.getVMixStateFromTimelineState(wrapInTimelineState({}), {
				inp0: wrapInMapping({
					mappingType: MappingVmixType.Input,
					index: '1',
				}),
			})
			expect(result.reportedState.existingInputs[1]).toBeDefined()
			expect(result.reportedState.existingInputsAudio[1]).toBeUndefined() // but audio is independend
		})

		it('tracks audio state for mapped existing inputs', () => {
			const converter = createTestee()

			const result = converter.getVMixStateFromTimelineState(wrapInTimelineState({}), {
				inp0: wrapInMapping({
					mappingType: MappingVmixType.AudioChannel,
					index: '1',
				}),
			})
			expect(result.reportedState.existingInputs[1]).toBeUndefined()
			expect(result.reportedState.existingInputsAudio[1]).toBeDefined()
		})

		it('tracks state for mapped inputs added by us', () => {
			const converter = createTestee()
			const filePath = 'C:\\someFile.mp4'
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					inp0: {
						deviceType: DeviceType.VMIX,
						filePath: 'C:\\someFile.mp4',
						type: TimelineContentTypeVMix.INPUT,
						inputType: VMixInputType.Video,
					},
				}),
				{
					inp0: wrapInMapping({
						mappingType: MappingVmixType.Input,
					}),
				}
			)
			expect(result.reportedState.inputsAddedByUs[prefixAddedInput(filePath)]).toBeDefined()
			expect(result.reportedState.inputsAddedByUsAudio[prefixAddedInput(filePath)]).toBeUndefined()
		})

		it('supports text', () => {
			const converter = createTestee()
			const text = { 'myTitle.Text': 'SomeValue', 'myTitle.Foo': 'Bar' }
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					inp0: {
						deviceType: DeviceType.VMIX,
						text,
						type: TimelineContentTypeVMix.INPUT,
					},
				}),
				{
					inp0: wrapInMapping({
						mappingType: MappingVmixType.Input,
						index: '1',
					}),
				}
			)
			expect(result.reportedState.existingInputs['1'].text).toEqual(text)
		})

		it('allows overriding transitions in usual layer order', () => {
			const converter = createTestee()
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					pgm0: {
						deviceType: DeviceType.VMIX,
						type: TimelineContentTypeVMix.PROGRAM,
						input: 2,
					},
					pgm1: {
						deviceType: DeviceType.VMIX,
						type: TimelineContentTypeVMix.PROGRAM,
						transition: {
							duration: 500,
							effect: VMixTransitionType.Fade,
						},
					},
				}),
				{
					pgm0: wrapInMapping({
						mappingType: MappingVmixType.Program,
					}),
					pgm1: wrapInMapping({
						mappingType: MappingVmixType.Program,
					}),
				}
			)
			expect(result.reportedState.mixes[0]?.transition).toEqual({
				duration: 500,
				effect: VMixTransitionType.Fade,
			})
			expect(result.reportedState.mixes[0]?.program).toEqual(2)
		})

		it('does not allow overriding transitions in reverse layer order', () => {
			const converter = createTestee()
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					pgm0: {
						deviceType: DeviceType.VMIX,
						type: TimelineContentTypeVMix.PROGRAM,
						transition: {
							duration: 500,
							effect: VMixTransitionType.Fade,
						},
					},
					pgm1: {
						deviceType: DeviceType.VMIX,
						type: TimelineContentTypeVMix.PROGRAM,
						input: 2,
					},
				}),
				{
					pgm0: wrapInMapping({
						mappingType: MappingVmixType.Program,
					}),
					pgm1: wrapInMapping({
						mappingType: MappingVmixType.Program,
					}),
				}
			)
			expect(result.reportedState.mixes[0]?.transition).toEqual({
				duration: 0,
				effect: VMixTransitionType.Cut,
			})
			expect(result.reportedState.mixes[0]?.program).toEqual(2)
		})
		it('supports url', () => {
			const converter = createTestee()
			const url = 'https://example.com'
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					inp0: {
						deviceType: DeviceType.VMIX,
						url,
						type: TimelineContentTypeVMix.INPUT,
					},
				}),
				{
					inp0: wrapInMapping({
						mappingType: MappingVmixType.Input,
						index: '1',
					}),
				}
			)
			expect(result.reportedState.existingInputs['1'].url?.value).toEqual(url)
		})
		it('supports index', () => {
			const converter = createTestee()
			const index = 3
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					inp0: {
						deviceType: DeviceType.VMIX,
						index,
						type: TimelineContentTypeVMix.INPUT,
					},
				}),
				{
					inp0: wrapInMapping({
						mappingType: MappingVmixType.Input,
						index: '1',
					}),
				}
			)
			expect(result.reportedState.existingInputs['1'].index?.value).toEqual(index)
		})

		it('supports images (titles)', () => {
			const converter = createTestee()
			const images = { 'myImage1.Source': 'foo.png', 'myImage2.Source': 'bar.jpg' }
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					inp0: {
						deviceType: DeviceType.VMIX,
						images,
						type: TimelineContentTypeVMix.INPUT,
					},
				}),
				{
					inp0: wrapInMapping({
						mappingType: MappingVmixType.Input,
						index: '1',
					}),
				}
			)
			expect(result.reportedState.existingInputs['1'].images).toEqual(images)
		})

		it('supports audio buses', () => {
			const converter = createTestee()
			const bus = { muted: false, volume: 50 }
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					inp0: {
						deviceType: DeviceType.VMIX,
						...bus,
						type: TimelineContentTypeVMix.AUDIO_BUS,
					},
				}),
				{
					inp0: wrapInMapping({
						mappingType: MappingVmixType.AudioBus,
						index: 'B',
					}),
				}
			)
			expect(result.reportedState.audioBuses.B).toEqual(bus)
		})

		// TODO: maybe we can't trust the defaults when adding an input? Make this test pass eventually
		// it('tracks audio state for mapped inputs added by us', () => {
		// 	const converter = createTestee()
		// 	const filePath = 'C:\\someFile.mp4'
		// 	const result = converter.getVMixStateFromTimelineState(
		// 		wrapInTimelineState({
		// 			inp0: {
		// 				deviceType: DeviceType.VMIX,
		// 				filePath: 'C:\\someFile.mp4',
		// 				type: TimelineContentTypeVMix.INPUT,
		// 				inputType: VMixInputType.Video,
		// 			},
		// 		}),
		// 		{
		// 			inp0: wrapInMapping({
		// 				mappingType: MappingVmixType.Input,
		// 			}),
		// 			inp0_audio: wrapInMapping({
		// 				mappingType: MappingVmixType.AudioChannel,
		// 				inputLayer: 'inp0',
		// 			}),
		// 		}
		// 	)
		// 	expect(result.reportedState.inputsAddedByUs[prefixAddedInput(filePath)]).toBeDefined()
		// 	expect(result.reportedState.inputsAddedByUsAudio[prefixAddedInput(filePath)]).toBeDefined()
		// })

		test('isLookahead is true when object is a lookahead', () => {
			const converter = createTestee()
			const list = ['clip.mp4']
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					inp0: wrapInTimelineObject(
						'inp0',
						{
							deviceType: DeviceType.VMIX,
							listFilePaths: list,
							type: TimelineContentTypeVMix.INPUT,
						},
						{
							isLookahead: true,
						}
					),
				}),
				{
					inp0: wrapInMapping({
						mappingType: MappingVmixType.Input,
						index: '1',
					}),
				}
			)
			expect(result.reportedState.existingInputs['1'].listFilePaths?.isLookahead).toEqual(true)
		})

		test('isLookahead is false when object is not a lookahead', () => {
			const converter = createTestee()
			const list = ['clip.mp4']
			const result = converter.getVMixStateFromTimelineState(
				wrapInTimelineState({
					inp0: wrapInTimelineObject(
						'inp0',
						{
							deviceType: DeviceType.VMIX,
							listFilePaths: list,
							type: TimelineContentTypeVMix.INPUT,
						},
						{
							isLookahead: false,
						}
					),
				}),
				{
					inp0: wrapInMapping({
						mappingType: MappingVmixType.Input,
						index: '1',
					}),
				}
			)
			expect(result.reportedState.existingInputs['1'].listFilePaths?.isLookahead).toEqual(false)
		})
	})

	describe('replay', () => {
		it('does not track state when not mapped', () => {
			const converter = createTestee()

			const result = converter.getVMixStateFromTimelineState(wrapInTimelineState({}), {})
			expect(result.reportedState.replay).toBe(undefined)
		})

		it('tracks state for mapped existing inputs', () => {
			const converter = createTestee()

			const result = converter.getVMixStateFromTimelineState(wrapInTimelineState({}), {
				replay0: wrapInMapping({
					mappingType: MappingVmixType.Replay,
				}),
			})
			expect(result.reportedState.replay?.recording).toBe(false)
		})

		it('does not apply default state when disableDefaults===true', () => {
			const converter = createTestee()

			const result = converter.getVMixStateFromTimelineState(wrapInTimelineState({}), {
				replay0: wrapInMapping({
					mappingType: MappingVmixType.Replay,
					disableDefaults: true,
				}),
			})
			expect(result.reportedState.replay).toBeUndefined()
		})
	})
})
