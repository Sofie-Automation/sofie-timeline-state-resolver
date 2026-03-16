import { Enum } from 'casparcg-connection'
import { CasparCGScaleMode } from '../index.js'

describe('CasparCG types', () => {
	test('CasparCGScaleMode', async () => {
		expect(CasparCGScaleMode).toEqual(Enum.ProducerScaleMode)
	})
})
