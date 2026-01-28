import {
	TSRTimelineContent,
	Mappings,
	Mapping,
	SomeMappingSofieChef,
	DeviceType,
	interpolateTemplateStringIfNeeded,
} from 'timeline-state-resolver-types'
import type { SofieChefState } from './index.js'
import { DeviceTimelineState } from 'timeline-state-resolver-api'

export function buildSofieChefState(
	timelineState: DeviceTimelineState<TSRTimelineContent>,
	mappings: Mappings
): SofieChefState {
	const sofieChefState: SofieChefState = {
		windows: {},
	}
	for (const tlObject of timelineState.objects) {
		const mapping = mappings[tlObject.layer] as Mapping<SomeMappingSofieChef> | undefined
		const content = tlObject.content

		if (mapping && content.deviceType === DeviceType.SOFIE_CHEF) {
			sofieChefState.windows[mapping.options.windowId] = {
				url: interpolateTemplateStringIfNeeded(content.url),
				urlTimelineObjId: tlObject.id,
			}
		}
	}
	return sofieChefState
}
