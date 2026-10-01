import {
	dereferenceEnvironmentStringIfNeeded,
	dereferenceEnvironmentStringsIfIndicated,
	type EnvironmentString,
} from '../environmentString.js'

describe('dereferenceEnvironmentStringIfNeeded', () => {
	const environmentVariable = 'TSR_ENVIRONMENT_STRING_TEST'

	afterEach(() => {
		delete process.env[environmentVariable]
	})

	test('returns a regular string unchanged', () => {
		expect(dereferenceEnvironmentStringIfNeeded('regular value')).toBe('regular value')
	})

	test('resolves an environment string', () => {
		process.env[environmentVariable] = 'environment value'
		const value: EnvironmentString = `\${env:${environmentVariable}}`

		expect(dereferenceEnvironmentStringIfNeeded(value)).toBe('environment value')
	})

	test('throws when the environment variable is missing', () => {
		expect(() => dereferenceEnvironmentStringIfNeeded(`\${env:${environmentVariable}}`)).toThrow(
			`Environment variable '${environmentVariable}' not found`
		)
	})
})

describe('dereferenceEnvironmentStringsIfIndicated', () => {
	const environmentVariable = 'TSR_NESTED_ENVIRONMENT_STRING_TEST'

	afterEach(() => {
		delete process.env[environmentVariable]
	})

	test('does not resolve an object that has not opted in', () => {
		const input = {
			value: `\${env:${environmentVariable}}`,
		}

		expect(dereferenceEnvironmentStringsIfIndicated(input)).toEqual(input)
	})

	test('resolves direct properties and array values in an opted-in object without mutating the input', () => {
		process.env[environmentVariable] = 'environment value'
		const input = {
			$resolveEnvironmentVariables: true,
			direct: `\${env:${environmentVariable}}`,
			values: ['regular value', `\${env:${environmentVariable}}`],
		}

		expect(dereferenceEnvironmentStringsIfIndicated(input)).toEqual({
			direct: 'environment value',
			values: ['regular value', 'environment value'],
		})
		expect(input.direct).toBe(`\${env:${environmentVariable}}`)
		expect(input.$resolveEnvironmentVariables).toBe(true)
	})

	test('propagates opt-in to nested objects', () => {
		process.env[environmentVariable] = 'environment value'
		const input = {
			$resolveEnvironmentVariables: true,
			nested: {
				value: `\${env:${environmentVariable}}`,
			},
		}

		expect(dereferenceEnvironmentStringsIfIndicated(input)).toEqual({
			nested: {
				value: 'environment value',
			},
		})
	})

	test('resolves a nested object that opts in below an unmarked parent', () => {
		process.env[environmentVariable] = 'environment value'
		const input = {
			unmarked: `\${env:${environmentVariable}}`,
			nested: {
				$resolveEnvironmentVariables: true,
				value: `\${env:${environmentVariable}}`,
			},
		}

		expect(dereferenceEnvironmentStringsIfIndicated(input)).toEqual({
			unmarked: `\${env:${environmentVariable}}`,
			nested: {
				value: 'environment value',
			},
		})
	})
})
