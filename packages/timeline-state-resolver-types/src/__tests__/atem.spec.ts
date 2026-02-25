import { Enums as AtemStateEnums } from 'atem-state'
import { AtemTransitionStyle } from '../index.js'

describe('Atem types', () => {
	test('Atem types: TransitionStyle', async () => {
		expect(AtemTransitionStyle).toEqual(AtemStateEnums.TransitionStyle)
	})
})
