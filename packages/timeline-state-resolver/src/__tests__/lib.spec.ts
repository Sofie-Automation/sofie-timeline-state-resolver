import { set } from '../lib.js'

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
