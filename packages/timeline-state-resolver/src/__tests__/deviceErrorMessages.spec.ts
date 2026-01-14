import { DeviceStatusError } from 'timeline-state-resolver-types'
import { errorsToMessages } from '../deviceErrorMessages'
import { createAtemError } from '../integrations/atem/errors'

// Example device-local error definitions (mimicking what each device would export)
const AtemErrorCode = {
	DISCONNECTED: 'DEVICE_ATEM_DISCONNECTED',
	PSU_FAULT: 'DEVICE_ATEM_PSU_FAULT',
} as const
type AtemErrorCode = (typeof AtemErrorCode)[keyof typeof AtemErrorCode]

const AtemErrorMessages: Record<AtemErrorCode, string> = {
	[AtemErrorCode.DISCONNECTED]: 'ATEM disconnected',
	[AtemErrorCode.PSU_FAULT]: 'ATEM PSU {{psuNumber}} is faulty ({{totalPsus}} PSU(s))',
}

// Another example device
const HttpErrorCode = {
	TIMEOUT: 'DEVICE_HTTP_TIMEOUT',
} as const
type HttpErrorCode = (typeof HttpErrorCode)[keyof typeof HttpErrorCode]

interface HttpTimeoutContext {
	url: string
	timeout: number
	[key: string]: unknown
}

function createHttpError(
	code: typeof HttpErrorCode.TIMEOUT,
	context: HttpTimeoutContext
): DeviceStatusError<typeof HttpErrorCode.TIMEOUT> {
	return { code, context }
}

const HttpErrorMessages: Record<HttpErrorCode, string> = {
	[HttpErrorCode.TIMEOUT]: 'HTTP request to {{url}} timed out after {{timeout}}ms',
}

describe('errorsToMessages', () => {
	it('converts a single error to a message', () => {
		const errors = [createAtemError(AtemErrorCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' })]
		const messages = errorsToMessages(errors, AtemErrorMessages)
		expect(messages).toEqual(['ATEM disconnected'])
	})

	it('interpolates context variables', () => {
		const errors = [
			createAtemError(AtemErrorCode.PSU_FAULT, {
				host: '192.168.1.10',
				deviceName: 'Main Switcher',
				psuNumber: 2,
				totalPsus: 2,
			}),
		]
		const messages = errorsToMessages(errors, AtemErrorMessages)
		expect(messages).toEqual(['ATEM PSU 2 is faulty (2 PSU(s))'])
	})

	it('handles multiple errors', () => {
		const errors = [
			createAtemError(AtemErrorCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' }),
			createAtemError(AtemErrorCode.PSU_FAULT, {
				host: '192.168.1.10',
				deviceName: 'Main Switcher',
				psuNumber: 1,
				totalPsus: 2,
			}),
		]
		const messages = errorsToMessages(errors, AtemErrorMessages)
		expect(messages).toEqual(['ATEM disconnected', 'ATEM PSU 1 is faulty (2 PSU(s))'])
	})

	it('uses custom templates when provided', () => {
		const errors = [createAtemError(AtemErrorCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' })]
		const customTemplates = {
			...AtemErrorMessages,
			[AtemErrorCode.DISCONNECTED]: 'Vision mixer offline ({{host}})',
		}
		const messages = errorsToMessages(errors, customTemplates)
		expect(messages).toEqual(['Vision mixer offline (192.168.1.10)'])
	})

	it('falls back to error code if template not found', () => {
		const errors = [createAtemError(AtemErrorCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' })]
		const messages = errorsToMessages(errors, {})
		expect(messages).toEqual(['DEVICE_ATEM_DISCONNECTED'])
	})

	it('keeps placeholder if context value missing', () => {
		const errors = [
			createHttpError(HttpErrorCode.TIMEOUT, {
				url: 'http://example.com',
				timeout: 5000,
			}),
		]
		// Use a template that references a variable not in context
		const customTemplates = {
			[HttpErrorCode.TIMEOUT]: 'Timeout after {{timeout}}ms ({{missingVar}})',
		}
		const messages = errorsToMessages(errors, customTemplates)
		expect(messages).toEqual(['Timeout after 5000ms ({{missingVar}})'])
	})

	it('handles empty errors array', () => {
		const messages = errorsToMessages([])
		expect(messages).toEqual([])
	})

	it('includes optional deviceName and deviceId in context', () => {
		const errors = [
			createAtemError(AtemErrorCode.DISCONNECTED, {
				host: '192.168.1.10',
				deviceName: 'Main Switcher',
			}),
		]
		const customTemplates = {
			[AtemErrorCode.DISCONNECTED]: '{{deviceName}}: ATEM at {{host}} disconnected',
		}
		const messages = errorsToMessages(errors, customTemplates)
		expect(messages).toEqual(['Main Switcher: ATEM at 192.168.1.10 disconnected'])
	})

	it('combines templates from multiple devices', () => {
		const allMessages = { ...AtemErrorMessages, ...HttpErrorMessages }
		const errors: DeviceStatusError[] = [
			createAtemError(AtemErrorCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' }),
			createHttpError(HttpErrorCode.TIMEOUT, { url: 'http://api.example.com', timeout: 5000 }),
		]
		const messages = errorsToMessages(errors, allMessages)
		expect(messages).toEqual(['ATEM disconnected', 'HTTP request to http://api.example.com timed out after 5000ms'])
	})
})
