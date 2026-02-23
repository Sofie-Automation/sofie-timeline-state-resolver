import type { DeviceTimelineState } from 'timeline-state-resolver-api'
import {
	DeviceType,
	Mapping,
	Mappings,
	SomeMappingViscaOverIP,
	TSRTimelineContent,
	TimelineContentTypeViscaOverIp,
} from 'timeline-state-resolver-types'

export interface ViscaOverIpStateValue<T> {
	value: T
	timelineObjId: string
}

export interface ViscaOverIpDeviceState {
	preset?: ViscaOverIpStateValue<number>
	panTiltSpeed?: ViscaOverIpStateValue<{ panSpeed: number; tiltSpeed: number }>
	zoomSpeed?: ViscaOverIpStateValue<number>
	focusSpeed?: ViscaOverIpStateValue<number>
}

export function getDefaultState(): ViscaOverIpDeviceState {
	return {}
}

export function convertStateToVisca(
	state: DeviceTimelineState<TSRTimelineContent>,
	mappings: Mappings
): ViscaOverIpDeviceState {
	const viscaState: ViscaOverIpDeviceState = getDefaultState()

	for (const tlObject of state.objects) {
		const mapping = mappings[tlObject.layer] as Mapping<SomeMappingViscaOverIP> | undefined
		if (
			!mapping ||
			mapping.device !== DeviceType.VISCA_OVER_IP ||
			tlObject.content.deviceType !== DeviceType.VISCA_OVER_IP
		) {
			continue
		}

		// Note: no mapping types currently, so this can be quite loose
		const content = tlObject.content
		switch (content.type) {
			case TimelineContentTypeViscaOverIp.RECALL_PRESET:
				viscaState.preset = {
					value: content.preset,
					timelineObjId: tlObject.id,
				}
				break
			case TimelineContentTypeViscaOverIp.PAN_TILT_SPEED:
				viscaState.panTiltSpeed = {
					value: { panSpeed: content.panSpeed, tiltSpeed: content.tiltSpeed },
					timelineObjId: tlObject.id,
				}
				break
			case TimelineContentTypeViscaOverIp.ZOOM_SPEED:
				viscaState.zoomSpeed = {
					value: content.zoomSpeed,
					timelineObjId: tlObject.id,
				}
				break
			case TimelineContentTypeViscaOverIp.FOCUS_SPEED:
				viscaState.focusSpeed = {
					value: content.focusSpeed,
					timelineObjId: tlObject.id,
				}
				break
		}
	}

	return viscaState
}
