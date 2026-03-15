import {
	DeviceType,
	Mapping,
	MappingViscaOverIPType,
	Mappings,
	SomeMappingViscaOverIP,
	TSRTimelineContent,
	TimelineContentTypeViscaOverIp,
} from 'timeline-state-resolver-types'
import { DeviceTimelineState } from 'timeline-state-resolver-api'
import { convertStateToVisca, getDefaultState, ViscaOverIpDeviceState } from '../state.js'

function makeMapping(deviceId = 'visca0'): Mapping<SomeMappingViscaOverIP> {
	return {
		device: DeviceType.VISCA_OVER_IP,
		deviceId,
		options: {
			mappingType: MappingViscaOverIPType.Camera,
		},
	}
}

function makeState(
	objs: Array<{ id: string; layer: string; content: TSRTimelineContent }>
): DeviceTimelineState<TSRTimelineContent> {
	return { time: 1000, objects: objs as any }
}

const mappings: Mappings = {
	cam_preset: makeMapping(),
	cam_pt: makeMapping(),
	cam_zoom: makeMapping(),
	cam_focus: makeMapping(),
}

describe('convertStateToVisca', () => {
	it('returns empty state for an empty timeline', () => {
		const result = convertStateToVisca(makeState([]), mappings)
		expect(result).toEqual(getDefaultState())
	})

	it('maps a RECALL_PRESET timeline object to preset state', () => {
		const result = convertStateToVisca(
			makeState([
				{
					id: 'obj1',
					layer: 'cam_preset',
					content: {
						deviceType: DeviceType.VISCA_OVER_IP,
						type: TimelineContentTypeViscaOverIp.RECALL_PRESET,
						preset: 3,
					},
				},
			]),
			mappings
		)

		expect(result).toEqual<ViscaOverIpDeviceState>({
			preset: { value: 3, timelineObjId: 'obj1' },
		})
	})

	it('maps a PAN_TILT_SPEED timeline object to panTiltSpeed state', () => {
		const result = convertStateToVisca(
			makeState([
				{
					id: 'obj2',
					layer: 'cam_pt',
					content: {
						deviceType: DeviceType.VISCA_OVER_IP,
						type: TimelineContentTypeViscaOverIp.PAN_TILT_SPEED,
						panSpeed: 0.5,
						tiltSpeed: -0.25,
					},
				},
			]),
			mappings
		)

		expect(result).toEqual<ViscaOverIpDeviceState>({
			panTiltSpeed: { value: { panSpeed: 0.5, tiltSpeed: -0.25 }, timelineObjId: 'obj2' },
		})
	})

	it('maps a ZOOM_SPEED timeline object to zoomSpeed state', () => {
		const result = convertStateToVisca(
			makeState([
				{
					id: 'obj3',
					layer: 'cam_zoom',
					content: {
						deviceType: DeviceType.VISCA_OVER_IP,
						type: TimelineContentTypeViscaOverIp.ZOOM_SPEED,
						zoomSpeed: -1,
					},
				},
			]),
			mappings
		)

		expect(result).toEqual<ViscaOverIpDeviceState>({
			zoomSpeed: { value: -1, timelineObjId: 'obj3' },
		})
	})

	it('maps a FOCUS_SPEED timeline object to focusSpeed state', () => {
		const result = convertStateToVisca(
			makeState([
				{
					id: 'obj4',
					layer: 'cam_focus',
					content: {
						deviceType: DeviceType.VISCA_OVER_IP,
						type: TimelineContentTypeViscaOverIp.FOCUS_SPEED,
						focusSpeed: 0.75,
					},
				},
			]),
			mappings
		)

		expect(result).toEqual<ViscaOverIpDeviceState>({
			focusSpeed: { value: 0.75, timelineObjId: 'obj4' },
		})
	})

	it('handles multiple layers simultaneously', () => {
		const result = convertStateToVisca(
			makeState([
				{
					id: 'p1',
					layer: 'cam_preset',
					content: {
						deviceType: DeviceType.VISCA_OVER_IP,
						type: TimelineContentTypeViscaOverIp.RECALL_PRESET,
						preset: 7,
					},
				},
				{
					id: 'z1',
					layer: 'cam_zoom',
					content: {
						deviceType: DeviceType.VISCA_OVER_IP,
						type: TimelineContentTypeViscaOverIp.ZOOM_SPEED,
						zoomSpeed: 0.5,
					},
				},
			]),
			mappings
		)

		expect(result).toEqual<ViscaOverIpDeviceState>({
			preset: { value: 7, timelineObjId: 'p1' },
			zoomSpeed: { value: 0.5, timelineObjId: 'z1' },
		})
	})

	it('ignores objects whose layer has no mapping', () => {
		const result = convertStateToVisca(
			makeState([
				{
					id: 'obj5',
					layer: 'unmapped_layer',
					content: {
						deviceType: DeviceType.VISCA_OVER_IP,
						type: TimelineContentTypeViscaOverIp.RECALL_PRESET,
						preset: 1,
					},
				},
			]),
			mappings
		)

		expect(result).toEqual({})
	})

	it('ignores objects whose content deviceType does not match the layer mapping device type', () => {
		// Layer correctly mapped to VISCA_OVER_IP, but the content is for a different device
		const result = convertStateToVisca(
			makeState([
				{
					id: 'obj7',
					layer: 'cam_preset',
					content: {
						deviceType: DeviceType.ABSTRACT,
						type: 'empty',
					},
				},
			]),
			mappings
		)

		expect(result).toEqual({})
	})
})
