import { DeviceStatusDetail, statusDetailsToMessages } from 'timeline-state-resolver-types'
import { createAtemStatusDetail } from '../integrations/atem/messages.js'

// Example device-local error definitions (mimicking what each device would export)
const AtemStatusCode = {
	DISCONNECTED: 'DEVICE_ATEM_DISCONNECTED',
	PSU_FAULT: 'DEVICE_ATEM_PSU_FAULT',
} as const
type AtemStatusCode = (typeof AtemStatusCode)[keyof typeof AtemStatusCode]

const AtemStatusMessages: Record<AtemStatusCode, string> = {
	[AtemStatusCode.DISCONNECTED]: 'ATEM disconnected',
	[AtemStatusCode.PSU_FAULT]: 'ATEM PSU {{psuNumber}} is faulty ({{totalPsus}} PSU(s))',
}

// Another example device
const HttpStatusCode = {
	TIMEOUT: 'DEVICE_HTTP_TIMEOUT',
} as const
type HttpStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode]

interface HttpTimeoutContext {
	url: string
	timeout: number
	[key: string]: unknown
}

function createHttpStatusDetail(
	code: typeof HttpStatusCode.TIMEOUT,
	context: HttpTimeoutContext
): DeviceStatusDetail<typeof HttpStatusCode.TIMEOUT> {
	return { code, context }
}

const HttpStatusMessages: Record<HttpStatusCode, string> = {
	[HttpStatusCode.TIMEOUT]: 'HTTP request to {{url}} timed out after {{timeout}}ms',
}

describe('statusDetailsToMessages', () => {
	it('converts a single error to a message', () => {
		const statusDetails = [
			createAtemStatusDetail(AtemStatusCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' }),
		]
		const messages = statusDetailsToMessages(statusDetails, AtemStatusMessages)
		expect(messages).toEqual(['ATEM disconnected'])
	})

	it('interpolates context variables', () => {
		const statusDetails = [
			createAtemStatusDetail(AtemStatusCode.PSU_FAULT, {
				host: '192.168.1.10',
				deviceName: 'Main Switcher',
				psuNumber: 2,
				totalPsus: 2,
			}),
		]
		const messages = statusDetailsToMessages(statusDetails, AtemStatusMessages)
		expect(messages).toEqual(['ATEM PSU 2 is faulty (2 PSU(s))'])
	})

	it('handles multiple errors', () => {
		const statusDetails = [
			createAtemStatusDetail(AtemStatusCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' }),
			createAtemStatusDetail(AtemStatusCode.PSU_FAULT, {
				host: '192.168.1.10',
				deviceName: 'Main Switcher',
				psuNumber: 1,
				totalPsus: 2,
			}),
		]
		const messages = statusDetailsToMessages(statusDetails, AtemStatusMessages)
		expect(messages).toEqual(['ATEM disconnected', 'ATEM PSU 1 is faulty (2 PSU(s))'])
	})

	it('uses custom templates when provided', () => {
		const statusDetails = [
			createAtemStatusDetail(AtemStatusCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' }),
		]
		const customTemplates = {
			...AtemStatusMessages,
			[AtemStatusCode.DISCONNECTED]: 'Vision mixer offline ({{host}})',
		}
		const messages = statusDetailsToMessages(statusDetails, customTemplates)
		expect(messages).toEqual(['Vision mixer offline (192.168.1.10)'])
	})

	it('falls back to error code if template not found', () => {
		const statusDetails = [
			createAtemStatusDetail(AtemStatusCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' }),
		]
		const messages = statusDetailsToMessages(statusDetails, {})
		expect(messages).toEqual(['DEVICE_ATEM_DISCONNECTED'])
	})

	it('keeps placeholder if context value missing', () => {
		const statusDetails = [
			createHttpStatusDetail(HttpStatusCode.TIMEOUT, {
				url: 'http://example.com',
				timeout: 5000,
			}),
		]
		// Use a template that references a variable not in context
		const customTemplates = {
			[HttpStatusCode.TIMEOUT]: 'Timeout after {{timeout}}ms ({{missingVar}})',
		}
		const messages = statusDetailsToMessages(statusDetails, customTemplates)
		expect(messages).toEqual(['Timeout after 5000ms ({{missingVar}})'])
	})

	it('handles empty errors array', () => {
		const messages = statusDetailsToMessages([])
		expect(messages).toEqual([])
	})

	it('includes optional deviceName and deviceId in context', () => {
		const statusDetails = [
			createAtemStatusDetail(AtemStatusCode.DISCONNECTED, {
				host: '192.168.1.10',
				deviceName: 'Main Switcher',
			}),
		]
		const customTemplates = {
			[AtemStatusCode.DISCONNECTED]: '{{deviceName}}: ATEM at {{host}} disconnected',
		}
		const messages = statusDetailsToMessages(statusDetails, customTemplates)
		expect(messages).toEqual(['Main Switcher: ATEM at 192.168.1.10 disconnected'])
	})

	it('combines templates from multiple devices', () => {
		const allMessages = { ...AtemStatusMessages, ...HttpStatusMessages }
		const statusDetails: DeviceStatusDetail[] = [
			createAtemStatusDetail(AtemStatusCode.DISCONNECTED, { host: '192.168.1.10', deviceName: 'Main Switcher' }),
			createHttpStatusDetail(HttpStatusCode.TIMEOUT, { url: 'http://api.example.com', timeout: 5000 }),
		]
		const messages = statusDetailsToMessages(statusDetails, allMessages)
		expect(messages).toEqual(['ATEM disconnected', 'HTTP request to http://api.example.com timed out after 5000ms'])
	})
})
