import type { CommandWithContext } from 'timeline-state-resolver-api'
import type { ViscaCommand } from './connection/index.js'
import { PanTiltDriveCommand, PresetCommand, ZoomCommand } from './connection/commands/visca/index.js'
import { FocusCommand } from './connection/commands/visca/focusCommand.js'
import * as ConnectionEnums from './connection/enums.js'
import type { ViscaValueConverter } from './connection/lib/ViscaValueConverter.js'
import type { ViscaOverIpDeviceState } from './state.js'

export type ViscaOverIpCommandWithContext = CommandWithContext<ViscaCommand, string>

export function diffViscaStates(
	converter: ViscaValueConverter,
	oldState: ViscaOverIpDeviceState,
	newState: ViscaOverIpDeviceState
): ViscaOverIpCommandWithContext[] {
	const commands: ViscaOverIpCommandWithContext[] = []

	// Only send a command when the new state has a value that differs from the old state.
	// When a field disappears (layer goes empty) we do nothing — no resting state.

	if (newState.preset !== undefined && newState.preset.value !== oldState.preset?.value) {
		commands.push({
			command: new PresetCommand(ConnectionEnums.PresetOperation.Recall, newState.preset.value),
			context: `preset changed (${oldState.preset?.value} → ${newState.preset.value})`,
			timelineObjId: newState.preset.timelineObjId,
		})
	}

	if (
		newState.panTiltSpeed !== undefined &&
		(newState.panTiltSpeed.value.panSpeed !== oldState.panTiltSpeed?.value.panSpeed ||
			newState.panTiltSpeed.value.tiltSpeed !== oldState.panTiltSpeed?.value.tiltSpeed)
	) {
		const { panSpeed, tiltSpeed } = newState.panTiltSpeed.value
		commands.push({
			command: new PanTiltDriveCommand(
				converter.mapPanTiltSpeedToViscaDirection(panSpeed, tiltSpeed),
				converter.mapPanTiltSpeedToVisca(panSpeed),
				converter.mapPanTiltSpeedToVisca(tiltSpeed)
			),
			context: `panTiltSpeed changed`,
			timelineObjId: newState.panTiltSpeed.timelineObjId,
		})
	}

	if (newState.zoomSpeed !== undefined && newState.zoomSpeed.value !== oldState.zoomSpeed?.value) {
		const { value: zoomSpeed } = newState.zoomSpeed
		commands.push({
			command: new ZoomCommand(
				converter.mapZoomSpeedToViscaDirection(zoomSpeed),
				converter.mapZoomSpeedToVisca(zoomSpeed)
			),
			context: `zoomSpeed changed (${oldState.zoomSpeed?.value} → ${zoomSpeed})`,
			timelineObjId: newState.zoomSpeed.timelineObjId,
		})
	}

	if (newState.focusSpeed !== undefined && newState.focusSpeed.value !== oldState.focusSpeed?.value) {
		const { value: focusSpeed } = newState.focusSpeed
		commands.push({
			command: new FocusCommand(
				converter.mapFocusSpeedToViscaDirection(focusSpeed),
				converter.mapFocusSpeedToVisca(focusSpeed)
			),
			context: `focusSpeed changed (${oldState.focusSpeed?.value} → ${focusSpeed})`,
			timelineObjId: newState.focusSpeed.timelineObjId,
		})
	}

	return commands
}
