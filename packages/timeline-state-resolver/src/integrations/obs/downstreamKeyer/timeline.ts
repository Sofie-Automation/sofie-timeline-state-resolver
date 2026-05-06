import type { OBSDeviceState } from '../state'

export function applyDownstreamKeyerTimelineObject(
	deviceState: OBSDeviceState,
	mapping: { mappingType: string },
	content: { type: string; [key: string]: any }
): void {
	if (mapping.mappingType !== 'downstreamKeyer') return
	if (content.type !== 'DOWNSTREAM_KEYER') return

	if (!deviceState.dsk) deviceState.dsk = {}
	deviceState.dsk.selectedScene = content.sceneName
	deviceState.dsk.ensureInDskList = content.ensureInDskList
}

