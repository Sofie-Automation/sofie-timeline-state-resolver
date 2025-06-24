import { VMixCommand, VMixInputType, VMixTransitionType } from 'timeline-state-resolver-types'
import { VMixStateDiffer } from '../vMixStateDiffer'
import { makeMockFullState, prefixAddedInput } from './mockState'
import { VMixStateCommand } from '../vMixCommands'

function createTestee(): VMixStateDiffer {
	return new VMixStateDiffer(() => Date.now(), jest.fn())
}

function createTestEnvironment() {
	const differ = createTestee()

	const oldState = makeMockFullState()
	const newState = makeMockFullState()

	return { differ, oldState, newState }
}

/**
 * Note: most of the coverage is still in vmix.spec.ts
 */
describe('VMixStateDiffer', () => {
	it('generates commands for input properties', async () => {
		const mockQueueNow = jest.fn()
		const differ = new VMixStateDiffer(() => Date.now(), mockQueueNow)

		const oldState = makeMockFullState()
		const newState = makeMockFullState()

		const filePath = 'C:/videos/My Clip.mp4'
		newState.reportedState.inputsAddedByUs[prefixAddedInput(filePath)] = {
			type: VMixInputType.Video,
			filePath: { value: filePath },
			playing: { value: true },
			loop: { value: true },
			position: { value: 10000 },
			transform: {
				value: {
					zoom: 0.5,
					panX: 0.3,
					panY: 1.2,
					alpha: 123,
				},
			},
			layers: {
				1: { input: 'G:/videos/My Other Clip.mp4' },
				3: { input: 5 },
			},
		}

		jest.useFakeTimers()
		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)
		jest.advanceTimersToNextTimer()

		expect(mockQueueNow).toHaveBeenCalledTimes(1)
		expect(mockQueueNow).toHaveBeenCalledWith([
			expect.objectContaining({
				command: {
					command: VMixCommand.ADD_INPUT,
					value: `Video|C:/videos/My Clip.mp4`,
				},
			}),
			expect.objectContaining({
				command: {
					command: VMixCommand.SET_INPUT_NAME,
					input: 'My Clip.mp4',
					value: prefixAddedInput('C:/videos/My Clip.mp4'),
				},
			}),
		])

		expect(commands.length).toBe(9)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_POSITION,
			input: prefixAddedInput('C:/videos/My Clip.mp4'),
			value: 10000,
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.LOOP_ON,
			input: prefixAddedInput('C:/videos/My Clip.mp4'),
		})
		expect(commands[2].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_ZOOM,
			input: prefixAddedInput('C:/videos/My Clip.mp4'),
			value: 0.5,
		})
		expect(commands[3].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_ALPHA,
			input: prefixAddedInput('C:/videos/My Clip.mp4'),
			value: 123,
		})
		expect(commands[4].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_PAN_X,
			input: prefixAddedInput('C:/videos/My Clip.mp4'),
			value: 0.3,
		})
		expect(commands[5].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_PAN_Y,
			input: prefixAddedInput('C:/videos/My Clip.mp4'),
			value: 1.2,
		})
		expect(commands[6].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_INPUT,
			input: prefixAddedInput('C:/videos/My Clip.mp4'),
			index: 1,
			value: 'G:/videos/My Other Clip.mp4',
		})
		expect(commands[7].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_INPUT,
			input: prefixAddedInput('C:/videos/My Clip.mp4'),
			index: 3,
			value: 5,
		})
		expect(commands[8].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.PLAY_INPUT,
			input: prefixAddedInput('C:/videos/My Clip.mp4'),
		})
	})

	it('generates commands for input properties (#2)', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['2'] = differ.getDefaultInputState(2)
		newState.reportedState.existingInputs['2'] = {
			...differ.getDefaultInputState(2),
			restart: { value: true },
			loop: { value: true },
			playing: { value: true },
			layers: {
				1: { input: 'G:/videos/My Other Clip.mp4' },
				3: { input: 5 },
			},
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(5)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.RESTART_INPUT,
			input: '2',
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.LOOP_ON,
			input: '2',
		})
		expect(commands[2].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_INPUT,
			input: '2',
			index: 1,
			value: 'G:/videos/My Other Clip.mp4',
		})
		expect(commands[3].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_INPUT,
			input: '2',
			index: 3,
			value: 5,
		})
		expect(commands[4].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.PLAY_INPUT,
			input: '2',
		})
	})

	it('generates commands for input properties (#3)', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['2'] = {
			...differ.getDefaultInputState(2),
			restart: { value: true },
			loop: { value: true },
			playing: { value: true },
			layers: {
				1: { input: 'G:/videos/My Other Clip.mp4' },
				3: { input: 5 },
			},
		}
		newState.reportedState.existingInputs['2'] = differ.getDefaultInputState(2)

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(4)

		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.PAUSE_INPUT,
			input: '2',
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.LOOP_OFF,
			input: '2',
		})
		expect(commands[2].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_INPUT,
			input: '2',
			index: 1,
			value: '',
		})
		expect(commands[3].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_INPUT,
			input: '2',
			index: 3,
			value: '',
		})
	})

	test('Address input by its layer', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		const filePath = 'C:/videos/My Clip.mp4'
		const layerName = 'vmix_media0'

		newState.reportedState.inputsAddedByUs[prefixAddedInput(filePath)] = {
			...differ.getDefaultInputState(prefixAddedInput(filePath)),
			type: VMixInputType.Video,
			filePath: { value: filePath },
		}
		newState.reportedState.inputsAddedByUsAudio[prefixAddedInput(filePath)] = {
			...differ.getDefaultInputAudioState(prefixAddedInput(filePath)),
			volume: 25,
		}
		newState.reportedState.mixes[0] = {
			number: 0,
			program: layerName,
			preview: undefined,
			transition: {
				effect: VMixTransitionType.Cut,
				duration: 0,
			},
			layerToProgram: true,
		}
		newState.inputLayers[layerName] = prefixAddedInput(filePath)

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(2)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.ACTIVE_INPUT,
			input: prefixAddedInput(filePath),
			mix: 0,
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_VOLUME,
			input: prefixAddedInput(filePath),
			value: 25,
			fade: 0,
		})
	})

	test('Address changing input by its layer', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		const filePath = 'C:/videos/My Clip.mp4'
		const layerName = 'vmix_media0'

		oldState.reportedState.inputsAddedByUs[prefixAddedInput(filePath)] = {
			...differ.getDefaultInputState(prefixAddedInput(filePath)),
			type: VMixInputType.Video,
			filePath: { value: filePath },
		}
		oldState.reportedState.inputsAddedByUsAudio[prefixAddedInput(filePath)] = {
			...differ.getDefaultInputAudioState(prefixAddedInput(filePath)),
			volume: 25,
		}
		oldState.reportedState.mixes[0] = {
			number: 0,
			program: layerName,
			preview: undefined,
			transition: {
				effect: VMixTransitionType.Cut,
				duration: 0,
			},
			layerToProgram: true,
		}
		oldState.inputLayers[layerName] = prefixAddedInput(filePath)

		const newFilePath = 'G:/videos/My Other Clip.mp4'
		newState.reportedState.inputsAddedByUs[prefixAddedInput(newFilePath)] = {
			...differ.getDefaultInputState(prefixAddedInput(newFilePath)),
			type: VMixInputType.Video,
			filePath: { value: filePath },
		}
		newState.reportedState.inputsAddedByUsAudio[prefixAddedInput(newFilePath)] = {
			...differ.getDefaultInputAudioState(prefixAddedInput(newFilePath)),
			volume: 25,
		}
		newState.reportedState.mixes[0] = {
			number: 0,
			program: layerName,
			preview: undefined,
			transition: {
				effect: VMixTransitionType.Cut,
				duration: 0,
			},
			layerToProgram: true,
		}
		newState.inputLayers[layerName] = prefixAddedInput(newFilePath)

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(2)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.ACTIVE_INPUT,
			input: prefixAddedInput(newFilePath),
			mix: 0,
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_VOLUME,
			input: prefixAddedInput(newFilePath),
			value: 25,
			fade: 0,
		})
	})

	test('Audio channel', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputsAudio['2'] = differ.getDefaultInputAudioState(2)
		newState.reportedState.existingInputsAudio['2'] = {
			...differ.getDefaultInputAudioState(2),
			volume: 46,
			fade: 1337,
			balance: 0.12,
			audioAuto: false,
			muted: false,
			audioBuses: 'A,C,F',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(8)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_VOLUME,
			input: '2',
			value: 46,
			fade: 1337,
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BALANCE,
			input: '2',
			value: 0.12,
		})
		expect(commands[2].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_AUTO_OFF,
			input: '2',
		})
		expect(commands[3].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BUS_ON,
			input: '2',
			value: 'A',
		})
		expect(commands[4].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BUS_ON,
			input: '2',
			value: 'C',
		})
		expect(commands[5].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BUS_ON,
			input: '2',
			value: 'F',
		})
		expect(commands[6].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BUS_OFF,
			input: '2',
			value: 'M',
		})
		expect(commands[7].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_ON,
			input: '2',
		})
	})

	test('Audio channel (#2)', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputsAudio['2'] = {
			...differ.getDefaultInputAudioState(2),
			volume: 46,
			fade: 1337,
			balance: 0.12,
			audioAuto: false,
			muted: false,
			audioBuses: 'A,C,F',
		}
		newState.reportedState.existingInputsAudio['2'] = differ.getDefaultInputAudioState(2)

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(8)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_OFF,
			input: '2',
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_VOLUME,
			input: '2',
			value: 100,
			fade: 0,
		})
		expect(commands[2].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BALANCE,
			input: '2',
			value: 0,
		})
		expect(commands[3].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_AUTO_ON,
			input: '2',
		})
		expect(commands[4].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BUS_ON,
			input: '2',
			value: 'M',
		})
		expect(commands[5].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BUS_OFF,
			input: '2',
			value: 'A',
		})
		expect(commands[6].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BUS_OFF,
			input: '2',
			value: 'C',
		})
		expect(commands[7].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.AUDIO_BUS_OFF,
			input: '2',
			value: 'F',
		})
	})

	test('Program bus', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		newState.reportedState.mixes[0] = {
			number: 0,
			program: 'Cam 1',
			preview: 3,
			transition: {
				effect: VMixTransitionType.VerticalSlideReverse,
				duration: 1337,
			},
		}
		newState.reportedState.mixes[1] = {
			number: 1,
			program: 5,
			preview: undefined,
			transition: {
				effect: VMixTransitionType.Cut,
				duration: 0,
			},
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(2)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.TRANSITION,
			input: 'Cam 1',
			duration: 1337,
			effect: VMixTransitionType.VerticalSlideReverse,
			mix: 0,
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.ACTIVE_INPUT,
			input: 5,
			mix: 1,
		})
	})

	test('Preview bus', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.mixes[0] = {
			number: 0,
			program: 'Cam 1',
			preview: 3,
			transition: {
				effect: VMixTransitionType.VerticalSlideReverse,
				duration: 1337,
			},
		}
		newState.reportedState.mixes[0] = {
			number: 1,
			program: 'Cam 1',
			preview: 6,
			transition: {
				effect: VMixTransitionType.VerticalSlideReverse,
				duration: 1337,
			},
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.PREVIEW_INPUT,
			input: 6,
			mix: 0,
		})
	})

	test('Overlay in', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		newState.reportedState.overlays[2] = { number: 2, input: 1 }

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.OVERLAY_INPUT_IN,
			input: 1,
			value: 2,
		})
	})

	test('Overlay out', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.overlays[2] = { number: 2, input: 1 }
		newState.reportedState.overlays[2] = { number: 2, input: undefined }

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.OVERLAY_INPUT_OUT,
			value: 2,
		})
	})

	describe('Outputs', () => {
		test('Output', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			newState.outputs.Fullscreen = { source: 'Preview' }

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.SET_OUPUT,
				name: 'Fullscreen',
				value: 'Preview',
			})
		})

		test('Output to uncontrolled', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.outputs.Fullscreen = { source: 'Preview' }

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(0)
		})

		test('Output an Input', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			newState.outputs.Fullscreen = { source: 'Input', input: 2 }

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.SET_OUPUT,
				name: 'Fullscreen',
				value: 'Input',
				input: 2,
			})
		})
	})

	describe('Recording', () => {
		test('on', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.recording = undefined
			newState.reportedState.recording = true

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.START_RECORDING,
			})
		})

		test('off', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.recording = true
			newState.reportedState.recording = false

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.STOP_RECORDING,
			})
		})

		test('uncontrolled', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.recording = true
			newState.reportedState.recording = undefined

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(0)
		})
	})

	describe('External', () => {
		test('on', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.external = false
			newState.reportedState.external = true

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.START_EXTERNAL,
			})
		})

		test('off', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.external = true
			newState.reportedState.external = false

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.STOP_EXTERNAL,
			})
		})

		test('uncontrolled', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.external = true
			newState.reportedState.external = undefined

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(0)
		})
	})

	describe('Streaming', () => {
		test('on', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.streaming = false
			newState.reportedState.streaming = true

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.START_STREAMING,
			})
		})

		test('off', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.streaming = true
			newState.reportedState.streaming = false

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.STOP_STREAMING,
			})
		})

		test('uncontrolled', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.streaming = true
			newState.reportedState.streaming = undefined

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(0)
		})
	})

	describe('Script', () => {
		test('Start', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			newState.runningScripts = ['myscript']

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.SCRIPT_START,
				value: 'myscript',
			})
		})

		test('Stop', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.runningScripts = ['myscript', 'another']
			newState.runningScripts = ['another']

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.SCRIPT_STOP,
				value: 'myscript',
			})
		})
	})

	describe('Fade to Black', () => {
		test('from undefined', async () => {
			const { differ, newState } = createTestEnvironment()

			newState.reportedState.fadeToBlack = true

			const commands = differ.getCommandsToAchieveState(Date.now(), undefined, newState)

			expect(commands.filter((command) => command.command.command === VMixCommand.FADE_TO_BLACK).length).toBe(0)
		})

		test('on', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.fadeToBlack = false
			newState.reportedState.fadeToBlack = true

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.FADE_TO_BLACK,
			})
		})

		test('off', async () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.fadeToBlack = true
			newState.reportedState.fadeToBlack = false

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.FADE_TO_BLACK,
			})
		})
	})

	describe('Fader', () => {
		test('from uncontrolled', () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.faderPosition = undefined
			newState.reportedState.faderPosition = 126

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.FADER,
				value: 126,
			})
		})

		test('change value', () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.faderPosition = 0
			newState.reportedState.faderPosition = 126

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.FADER,
				value: 126,
			})
		})

		test('to uncontrolled', () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.faderPosition = 126
			newState.reportedState.faderPosition = undefined

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(0)
		})
	})

	describe('List', () => {
		test('add', () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.existingInputs['1'] = {
				...differ.getDefaultInputState('1'),
			}
			newState.reportedState.existingInputs['1'] = {
				...differ.getDefaultInputState('1'),
				listFilePaths: { value: ['C:\\foo.mov'] },
			}

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(2)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.LIST_REMOVE_ALL,
				input: '1',
			})
			expect(commands[1].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.LIST_ADD,
				input: '1',
				value: 'C:\\foo.mov',
			})
		})

		test('remove all', () => {
			const { differ, oldState, newState } = createTestEnvironment()

			oldState.reportedState.existingInputs['1'] = {
				...differ.getDefaultInputState('1'),
			}
			newState.reportedState.existingInputs['1'] = {
				...differ.getDefaultInputState('1'),
				listFilePaths: { value: [] },
			}

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(2)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.PAUSE_INPUT,
				input: '1',
			})
			expect(commands[1].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.LIST_REMOVE_ALL,
				input: '1',
			})
		})
	})

	it('does not generate commands for identical states', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		expect(differ.getCommandsToAchieveState(Date.now(), oldState, newState)).toEqual([])
	})

	it('resets input audio bus assignment when input audio starts to be controlled', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		newState.reportedState.existingInputsAudio['99'] = differ.getDefaultInputAudioState(99)

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)
		const busCommands = commands.filter((command) => command.command.command === VMixCommand.AUDIO_BUS_OFF)

		expect(busCommands.length).toBe(7) // all but Master
	})

	it('sets layer input when it starts to be controlled', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].layers = {
			2: {
				input: 5,
			},
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_INPUT,
			value: 5,
			index: 2,
			input: '99',
		})
	})

	it('sets layer zoom', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		oldState.reportedState.existingInputs['99'].layers = {
			2: {
				input: 5,
			},
		}

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].layers = {
			2: {
				input: 5,
				zoom: 1.5,
			},
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_ZOOM,
			value: 1.5,
			index: 2,
			input: '99',
		})
	})

	it('sets layer pan', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		oldState.reportedState.existingInputs['99'].layers = {
			2: {
				input: 5,
			},
		}

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].layers = {
			2: {
				input: 5,
				panX: -1,
				panY: 2,
			},
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(2)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_PAN_X,
			value: -1,
			index: 2,
			input: '99',
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_PAN_Y,
			value: 2,
			index: 2,
			input: '99',
		})
	})

	it('sets layer crop', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		oldState.reportedState.existingInputs['99'].layers = {
			2: {
				input: 5,
			},
		}

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].layers = {
			2: {
				input: 5,
				cropLeft: 0.2,
				cropRight: 0.7,
				cropTop: 0.1,
				cropBottom: 0.8,
			},
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_CROP,
			index: 2,
			cropLeft: 0.2,
			cropRight: 0.7,
			cropTop: 0.1,
			cropBottom: 0.8,
			input: '99',
		})
	})

	it('sets text', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'].text = {
			'myTitle.Text': 'SomeValue',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_TEXT,
			input: '99',
			value: 'SomeValue',
			fieldName: 'myTitle.Text',
		})
	})

	it('sets multiple texts', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'].text = {
			'myTitle.Text': 'SomeValue',
			'myTitle.Foo': 'Bar',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(2)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_TEXT,
			input: '99',
			value: 'SomeValue',
			fieldName: 'myTitle.Text',
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_TEXT,
			input: '99',
			value: 'Bar',
			fieldName: 'myTitle.Foo',
		})
	})

	it('does not unset text', () => {
		// it would have to be explicitly set to an empty string on the timeline
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		oldState.reportedState.existingInputs['99'].text = {
			'myTitle.Text': 'SomeValue',
			'myTitle.Foo': 'Bar',
		}

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].text = {
			'myTitle.Foo': 'Bar',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(0)
	})

	it('updates text', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		oldState.reportedState.existingInputs['99'].text = {
			'myTitle.Text': 'SomeValue',
		}

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].text = {
			'myTitle.Text': 'Bar',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_TEXT,
			input: '99',
			value: 'Bar',
			fieldName: 'myTitle.Text',
		})
	})

	it('updates text to an empty string', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		oldState.reportedState.existingInputs['99'].text = {
			'myTitle.Text': 'SomeValue',
		}

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].text = {
			'myTitle.Text': '',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_TEXT,
			input: '99',
			value: '',
			fieldName: 'myTitle.Text',
		})
	})

	it('sets browser url', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		const url = 'https://example.com'
		newState.reportedState.existingInputs['99'].url = { value: url }

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.BROWSER_NAVIGATE,
			input: '99',
			value: url,
		})
	})
	it('sets index', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		const index = 3
		newState.reportedState.existingInputs['99'].index = { value: index }

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SELECT_INDEX,
			input: '99',
			value: index,
		})
	})

	it('sets images', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'].images = {
			'myImage.Source': 'image.png',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_IMAGE,
			input: '99',
			value: 'image.png',
			fieldName: 'myImage.Source',
		})
	})

	it('sets multiple images', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)

		newState.reportedState.existingInputs['99'].images = {
			'myImage1.Source': 'foo.png',
			'myImage2.Source': 'bar.jpg',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(2)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_IMAGE,
			input: '99',
			value: 'foo.png',
			fieldName: 'myImage1.Source',
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_IMAGE,
			input: '99',
			value: 'bar.jpg',
			fieldName: 'myImage2.Source',
		})
	})

	it('does not unset image', () => {
		// it would have to be explicitly set to an empty string on the timeline
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		oldState.reportedState.existingInputs['99'].images = {
			'myImage1.Source': 'foo.png',
			'myImage2.Source': 'bar.jpg',
		}

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].images = {
			'myImage2.Source': 'bar.jpg',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(0)
	})

	it('updates image', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		oldState.reportedState.existingInputs['99'].images = {
			'myImage1.Source': 'foo.png',
		}

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].images = {
			'myImage1.Source': 'bar.jpg',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_IMAGE,
			input: '99',
			value: 'bar.jpg',
			fieldName: 'myImage1.Source',
		})
	})

	it('updates image to an empty one', () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		oldState.reportedState.existingInputs['99'].images = {
			'myImage1.Source': 'foo.png',
		}

		newState.reportedState.existingInputs['99'] = differ.getDefaultInputState(99)
		newState.reportedState.existingInputs['99'].images = {
			'myImage1.Source': '',
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(1)
		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_IMAGE,
			input: '99',
			value: '',
			fieldName: 'myImage1.Source',
		})
	})

	describe('audio buses', () => {
		it('resets audio bus when starting to control it', () => {
			const { differ, oldState, newState } = createTestEnvironment()

			delete oldState.reportedState.audioBuses.A
			newState.reportedState.audioBuses.A = differ.getDefaultAudioBusState()

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(2)
			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.BUS_AUDIO_OFF,
				bus: 'A',
			})
			expect(commands[1].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.BUS_VOLUME,
				bus: 'A',
				value: 100,
			})
		})

		it('updates audio bus volume', () => {
			const { differ, oldState, newState } = createTestEnvironment()

			newState.reportedState.audioBuses.A = { ...differ.getDefaultAudioBusState(), volume: 75.2 }

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)

			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.BUS_VOLUME,
				bus: 'A',
				value: 75.2,
			})
		})

		it('turns audio bus on', () => {
			const { differ, oldState, newState } = createTestEnvironment()

			newState.reportedState.audioBuses.A = { ...differ.getDefaultAudioBusState(), muted: false }

			const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

			expect(commands.length).toBe(1)

			expect(commands[0].command).toMatchObject<VMixStateCommand>({
				command: VMixCommand.BUS_AUDIO_ON,
				bus: 'A',
			})
		})
	})

	test('Input command ordering using _isInUse', async () => {
		const { differ, oldState, newState } = createTestEnvironment()

		oldState.reportedState.existingInputs['11'] = differ.getDefaultInputState(11)
		oldState.reportedState.existingInputs['12'] = differ.getDefaultInputState(12)
		oldState.reportedState.mixes[0] = {
			number: 0,
			program: 11,
			preview: undefined,
			transition: {
				effect: VMixTransitionType.Cut,
				duration: 0,
			},
		}
		newState.reportedState.mixes[0] = {
			number: 0,
			program: 12,
			preview: undefined,
			transition: {
				effect: VMixTransitionType.Cut,
				duration: 0,
			},
		}
		newState.reportedState.existingInputs['11'] = {
			...differ.getDefaultInputState(11),
			listFilePaths: { value: [] }, // we want the list to be cleared after input 1 goes off PGM
		}
		newState.reportedState.existingInputs['12'] = {
			...differ.getDefaultInputState(12),
			layers: {
				1: { input: 3 }, // we want this to be shown before input 2 goes to PGM
			},
		}

		const commands = differ.getCommandsToAchieveState(Date.now(), oldState, newState)

		expect(commands.length).toBe(4)

		expect(commands[0].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.SET_LAYER_INPUT,
			input: '12',
			value: 3,
			index: 1,
		})
		expect(commands[1].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.ACTIVE_INPUT,
			input: 12,
			mix: 0,
		})
		expect(commands[2].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.PAUSE_INPUT,
			input: '11',
		})
		expect(commands[3].command).toMatchObject<VMixStateCommand>({
			command: VMixCommand.LIST_REMOVE_ALL,
			input: '11',
		})
	})
})
