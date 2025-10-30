import { Complete } from 'atem-state/dist/util'
import { DeviceTimelineStateObject } from 'timeline-state-resolver-api'
import { TSRTimelineContent } from 'timeline-state-resolver-types'
import { TimelineObject } from 'timeline-state-resolver-types/dist/superfly-timeline'

export function makeDeviceTimelineStateObject<TContent extends TSRTimelineContent>(
	object: TimelineObject<TContent>
): DeviceTimelineStateObject<TContent> {
	if (Array.isArray(object.enable)) throw new Error('Enable cannot be an array')
	if (typeof object.enable.start !== 'number') throw new Error('Enable must have numeric start')
	if (object.enable.end !== undefined && typeof object.enable.end !== 'number')
		throw new Error('Enable must have numeric end (if any)')
	if (object.enable.duration !== undefined && typeof object.enable.duration !== 'number')
		throw new Error('Enable must have numeric duration (if any)')

	return {
		id: object.id,
		layer: object.layer,
		priority: object.priority ?? 0,

		content: object.content,

		datastoreRefs: undefined,
		lastModified: undefined,

		isLookahead: false,
		lookaheadForLayer: undefined,

		instance: {
			id: `@${object.id}:0`,
			start: object.enable.start,
			end:
				object.enable.end ??
				(object.enable.duration !== undefined ? object.enable.start + object.enable.duration : null),
			references: [],
		},
	} satisfies Complete<DeviceTimelineStateObject<TContent>>
}
