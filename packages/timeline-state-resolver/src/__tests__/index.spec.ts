import * as _ from 'underscore'
import * as TSR from '../index.js'

describe('index', () => {
	test('imports', () => {
		// Just verify the exports, to catch breaking changes in exports:
		const exports: string[] = _.sortBy(Object.keys(TSR), (k) => k)
		expect(exports).toMatchSnapshot()
	})
})
