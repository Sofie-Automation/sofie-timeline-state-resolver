import { interpolateTemplateString, interpolateTemplateStringIfNeeded } from '../templateString.js'

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
