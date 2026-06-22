import { DeviceType, TimelineContentTypeVindralComposer } from 'timeline-state-resolver-types'
import { getDisabledScriptEngineWarnings } from '../../diffState.js'
import { EMPTY_STATE } from '../lib.js'
import { makeState } from './helpers.js'

describe('diffState — getDisabledScriptEngineWarnings', () => {
	const mpObj = (mediaPlayer: { sourceUrl?: string; inTime?: number; outTime?: number }) => ({
		enable: { start: 0 },
		id: 'obj0',
		layer: 'mpLayer',
		content: {
			deviceType: DeviceType.VINDRAL_COMPOSER,
			type: TimelineContentTypeVindralComposer.MEDIA_PLAYER,
			mediaPlayer,
		} as const,
	})

	test('no media players → no warnings', () => {
		expect(getDisabledScriptEngineWarnings({ ...EMPTY_STATE, stateTime: 0 })).toEqual([])
	})

	test('media player without in/out points → no warnings', () => {
		expect(getDisabledScriptEngineWarnings(makeState([mpObj({ sourceUrl: 'clip.mp4' })]))).toEqual([])
	})

	test('media player with inTime → one warning', () => {
		const warnings = getDisabledScriptEngineWarnings(makeState([mpObj({ sourceUrl: 'clip.mp4', inTime: 1000 })]))
		expect(warnings).toEqual([expect.stringContaining('media-player layer=mpLayer')])
	})

	test('media player with outTime → one warning', () => {
		const warnings = getDisabledScriptEngineWarnings(makeState([mpObj({ sourceUrl: 'clip.mp4', outTime: 5000 })]))
		expect(warnings).toHaveLength(1)
	})
})
