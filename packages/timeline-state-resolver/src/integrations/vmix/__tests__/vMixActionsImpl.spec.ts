/* eslint-disable @typescript-eslint/unbound-method */
import { mock } from 'jest-mock-extended'
import { vMixActionsImpl } from '../vMixActionsImpl'
import { VMixCommandSender } from '../connection'
import { ActionExecutionResultCode } from 'timeline-state-resolver-types'

const createTestee = () => {
	const mockSender = mock<VMixCommandSender>({ connected: true })
	const testee = new vMixActionsImpl(() => mockSender)
	return { testee, mockSender }
}

describe('vMixActionsImpl', () => {
	test('Last Preset', async () => {
		const { testee, mockSender } = createTestee()

		const result = await testee.lastPreset()

		expect(result).toMatchObject({
			result: ActionExecutionResultCode.Ok,
		})
		expect(mockSender.lastPreset).toHaveBeenCalledTimes(1)
	})

	test('Open Preset', async () => {
		const { testee, mockSender } = createTestee()

		const result = await testee.openPreset({ filename: 'C:\\Presets\\myPreset.vmix' })

		expect(result).toMatchObject({
			result: ActionExecutionResultCode.Ok,
		})
		expect(mockSender.openPreset).toHaveBeenCalledTimes(1)
		expect(mockSender.openPreset).toHaveBeenCalledWith('C:\\Presets\\myPreset.vmix')
	})

	test('Save Preset', async () => {
		const { testee, mockSender } = createTestee()

		const result = await testee.savePreset({ filename: 'C:\\Presets\\myPreset.vmix' })

		expect(result).toMatchObject({
			result: ActionExecutionResultCode.Ok,
		})
		expect(mockSender.savePreset).toHaveBeenCalledTimes(1)
		expect(mockSender.savePreset).toHaveBeenCalledWith('C:\\Presets\\myPreset.vmix')
	})

	test('Start External', async () => {
		const { testee, mockSender } = createTestee()

		const result = await testee.startExternal()

		expect(result).toMatchObject({
			result: ActionExecutionResultCode.Ok,
		})
		expect(mockSender.startExternal).toHaveBeenCalledTimes(1)
	})

	test('Stop External', async () => {
		const { testee, mockSender } = createTestee()

		const result = await testee.stopExternal()

		expect(result).toMatchObject({
			result: ActionExecutionResultCode.Ok,
		})
		expect(mockSender.stopExternal).toHaveBeenCalledTimes(1)
	})

	it('returns an error when not connected', async () => {
		const mockSender = mock<VMixCommandSender>({ connected: false })
		const testee = new vMixActionsImpl(() => mockSender)

		const result = await testee.lastPreset()

		expect(result).toMatchObject({
			result: ActionExecutionResultCode.Error,
		})
	})
})
