import { DeviceTimelineStateObject } from 'timeline-state-resolver-api'
import { TimelineContentTriCasterAny, TSRTimelineObj } from 'timeline-state-resolver-types'

export const wrapIntoResolvedInstance = <Content extends TimelineContentTriCasterAny>(
	timelineObject: TSRTimelineObj<Content>
): DeviceTimelineStateObject<Content> => ({
	...timelineObject,
	priority: timelineObject.priority ?? 0,

	instance: { start: 0, end: Infinity, id: `@${timelineObject.id}`, references: [] },
})
