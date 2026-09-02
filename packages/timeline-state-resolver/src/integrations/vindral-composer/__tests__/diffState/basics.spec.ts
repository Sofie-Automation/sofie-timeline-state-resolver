import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates } from './helpers.js'

describe('diffState — basics', () => {
	test('undefined old state → empty new state: no commands', () => {
		expect.hasAssertions()
		compareStates(MAPPINGS, undefined, { ...EMPTY_STATE, stateTime: 0 }, [])
	})

	test('empty → empty: no commands', () => {
		expect.hasAssertions()
		const s = { ...EMPTY_STATE, stateTime: 0 }
		compareStates(MAPPINGS, s, s, [])
	})
})
