import { interpolateTemplateString, interpolateTemplateStringIfNeeded, errorsToMessages } from '../templateString.js'
import { DeviceStatusError } from '../deviceError.js'

describe('interpolateTemplateString', () => {
	test('basic input', () => {
		expect(interpolateTemplateString('Hello there {{name}}', { name: 'Bob' })).toEqual('Hello there Bob')
	})

	test('missing arg preserves placeholder', () => {
		expect(interpolateTemplateString('Hello there {{name}}', {})).toEqual('Hello there {{name}}')
	})

	test('repeated arg', () => {
		expect(interpolateTemplateString('Hello there {{name}} {{name}} {{name}}', { name: 'Bob' })).toEqual(
			'Hello there Bob Bob Bob'
		)
	})

	test('mixed known and unknown args', () => {
		expect(interpolateTemplateString('{{greeting}} {{name}}!', { greeting: 'Hello' })).toEqual('Hello {{name}}!')
	})
})

describe('interpolateTemplateStringIfNeeded', () => {
	test('string input', () => {
		const input = 'Hello there'

		expect(interpolateTemplateStringIfNeeded(input)).toEqual(input)
	})

	test('object input', () => {
		expect(
			interpolateTemplateStringIfNeeded({
				key: 'Hello there {{name}}',
				args: { name: 'Bob' },
			})
		).toEqual('Hello there Bob')
	})
})

describe('errorsToMessages', () => {
	const mockErrorCode = {
		DISCONNECTED: 'DEVICE_MOCK_DISCONNECTED',
		TIMEOUT: 'DEVICE_MOCK_TIMEOUT',
	} as const

	const mockErrorMessages = {
		[mockErrorCode.DISCONNECTED]: '{{deviceName}} disconnected',
		[mockErrorCode.TIMEOUT]: '{{deviceName}} timeout after {{timeout}}ms',
	}

	test('converts single error to message', () => {
		const errors: DeviceStatusError[] = [{ code: mockErrorCode.DISCONNECTED, context: { deviceName: 'Test Device' } }]
		const messages = errorsToMessages(errors, mockErrorMessages)
		expect(messages).toEqual(['Test Device disconnected'])
	})

	test('converts multiple errors to messages', () => {
		const errors: DeviceStatusError[] = [
			{ code: mockErrorCode.DISCONNECTED, context: { deviceName: 'Device A' } },
			{ code: mockErrorCode.TIMEOUT, context: { deviceName: 'Device B', timeout: 5000 } },
		]
		const messages = errorsToMessages(errors, mockErrorMessages)
		expect(messages).toEqual(['Device A disconnected', 'Device B timeout after 5000ms'])
	})

	test('falls back to error code when template not found', () => {
		const errors: DeviceStatusError[] = [{ code: 'DEVICE_UNKNOWN_ERROR', context: { deviceName: 'Test Device' } }]
		const messages = errorsToMessages(errors, mockErrorMessages)
		expect(messages).toEqual(['DEVICE_UNKNOWN_ERROR'])
	})

	test('preserves unknown placeholders in templates', () => {
		const errors: DeviceStatusError[] = [{ code: mockErrorCode.DISCONNECTED, context: { deviceName: 'Test Device' } }]
		const customTemplates = {
			[mockErrorCode.DISCONNECTED]: '{{deviceName}} offline - {{missingVar}} - contact {{admin}}',
		}
		const messages = errorsToMessages(errors, customTemplates)
		expect(messages).toEqual(['Test Device offline - {{missingVar}} - contact {{admin}}'])
	})

	test('handles empty errors array', () => {
		const messages = errorsToMessages([])
		expect(messages).toEqual([])
	})

	test('handles empty templates object', () => {
		const errors: DeviceStatusError[] = [{ code: mockErrorCode.DISCONNECTED, context: { deviceName: 'Test Device' } }]
		const messages = errorsToMessages(errors, {})
		expect(messages).toEqual(['DEVICE_MOCK_DISCONNECTED'])
	})
})
