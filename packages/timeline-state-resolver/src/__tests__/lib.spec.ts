import { interpolateTemplateString, interpolateTemplateStringIfNeeded, set } from '../lib'

describe('interpolateTemplateString', () => {
	test('basic input', () => {
		expect(interpolateTemplateString('Hello there {{name}}', { name: 'Bob' })).toEqual('Hello there Bob')
	})

	test('missing arg', () => {
		expect(interpolateTemplateString('Hello there {{name}}', {})).toEqual('Hello there name')
	})

	test('repeated arg', () => {
		expect(interpolateTemplateString('Hello there {{name}} {{name}} {{name}}', { name: 'Bob' })).toEqual(
			'Hello there Bob Bob Bob'
		)
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
describe('set', () => {
	test('simplest path', () => {
		const obj: any = {}
		set(obj, 'myPath', 123)
		expect(obj).toStrictEqual({ myPath: 123 })
	})
	test('deep path input', () => {
		const obj: any = {}
		set(obj, 'a.b.c', 123)
		expect(obj).toStrictEqual({
			a: {
				b: {
					c: 123,
				},
			},
		})
	})
	test('set prop in a string', () => {
		const obj: any = {
			a: {
				b: 'a string',
			},
		}
		expect(() => set(obj, 'a.b.c', 123)).toThrow(
			`Unable to set property "a.b.c" of object {"a":{"b":"a string"}} to value 123. Original error: Cannot create property 'c' on string 'a string'`
		)
	})
})
