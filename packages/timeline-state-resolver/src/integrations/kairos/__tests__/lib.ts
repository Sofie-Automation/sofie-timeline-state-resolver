import { ResolvedTimelineObjectInstance } from 'superfly-timeline'
import { TimelineContentKairosAny, TSRTimelineContent } from 'timeline-state-resolver-types'
import { KairosDeviceState } from '../stateBuilder'

/** Convenience function to convert some KAIROS content into a ResolvedTimelineObjectInstance */
export function tlObjectInstance(
	startTime: number,
	content: TimelineContentKairosAny
): ResolvedTimelineObjectInstance<TSRTimelineContent> {
	return {
		content,
		enable: { start: startTime },
		id: 'obj0',
		instance: {
			id: '@obj0_instance0',
			start: startTime,
			end: null,
			references: [],
		},
		layer: 'N/A',
		resolved: {
			directReferences: [],
			firstResolved: true,
			instances: [],
			isKeyframe: false,
			isSelfReferencing: false,
			levelDeep: 0,
			parentId: undefined,
			resolvedConflicts: false,
			resolvedReferences: false,
			resolving: false,
		},
	}
}

export const EMPTY_STATE: Omit<KairosDeviceState, 'stateTime'> = {
	aux: {},
	clipPlayers: {},
	macros: {},
	ramRecPlayers: {},
	sceneLayers: {},
	sceneSnapshots: {},
	scenes: {},
	soundPlayers: {},
	imageStores: {},
}
