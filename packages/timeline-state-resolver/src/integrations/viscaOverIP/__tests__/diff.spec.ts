import { diffViscaStates } from '../diff.js'
import { getDefaultState, ViscaOverIpDeviceState } from '../state.js'
import { PresetCommand } from '../connection/commands/visca/index.js'
import { PanTiltDriveCommand } from '../connection/commands/visca/index.js'
import { ZoomCommand } from '../connection/commands/visca/index.js'
import { FocusCommand } from '../connection/commands/visca/focusCommand.js'
import { PresetOperation, PanTiltDirection, ZoomDirection, FocusDirection } from '../connection/enums.js'
import { ViscaValueConverter } from '../connection/lib/ViscaValueConverter.js'

/**
 * Explicit mock converter extending ViscaValueConverter.
 *
 * Numeric methods use deliberately unique multipliers so a cross-method mix-up produces a wrong
 * output value and causes an immediate assertion failure:
 *   pan/tilt speed  → |x| x 10
 *   zoom speed      → |x| x 20
 *   focus speed     → |x| x 30
 *
 * Direction methods use simple sign-based logic - they are already distinct by return type.
 * Unused methods throw 'not implemented' so any accidental call fails loudly.
 */
class MockViscaValueConverter implements ViscaValueConverter {
	mapPanTiltSpeedToVisca(speed: number): number {
		return Math.abs(speed) * 10
	}

	mapPanTiltSpeedToViscaDirection(pan: number, tilt: number): PanTiltDirection {
		if (pan < 0 && tilt > 0) return PanTiltDirection.UpLeft
		if (pan < 0 && tilt < 0) return PanTiltDirection.DownLeft
		if (pan < 0) return PanTiltDirection.Left
		if (pan > 0 && tilt > 0) return PanTiltDirection.UpRight
		if (pan > 0 && tilt < 0) return PanTiltDirection.DownRight
		if (pan > 0) return PanTiltDirection.Right
		if (tilt > 0) return PanTiltDirection.Up
		if (tilt < 0) return PanTiltDirection.Down
		return PanTiltDirection.Stop
	}

	mapZoomSpeedToVisca(speed: number): number {
		return Math.abs(speed) * 20
	}

	mapZoomSpeedToViscaDirection(speed: number): ZoomDirection {
		if (speed > 0) return ZoomDirection.TeleVariable
		if (speed < 0) return ZoomDirection.WideVariable
		return ZoomDirection.Stop
	}

	mapFocusSpeedToVisca(speed: number): number {
		return Math.abs(speed) * 30
	}

	mapFocusSpeedToViscaDirection(speed: number): FocusDirection {
		if (speed > 0) return FocusDirection.FarVariable
		if (speed < 0) return FocusDirection.NearVariable
		return FocusDirection.Stop
	}

	mapFocusModeToVisca(): never {
		throw new Error('not implemented')
	}
	mapFocusPositionFromVisca(): never {
		throw new Error('not implemented')
	}
	mapZoomPositionFromVisca(): never {
		throw new Error('not implemented')
	}
	mapPanTiltPositionFromVisca(): never {
		throw new Error('not implemented')
	}
	mapFocusModeFromVisca(): never {
		throw new Error('not implemented')
	}
}

const converter = new MockViscaValueConverter()

describe('diffStates', () => {
	it('returns no commands for two empty states', () => {
		expect(diffViscaStates(converter, getDefaultState(), getDefaultState())).toHaveLength(0)
	})

	describe('RECALL_PRESET', () => {
		it('emits a PresetCommand (Recall) when preset appears', () => {
			const commands = diffViscaStates(converter, getDefaultState(), {
				preset: { value: 3, timelineObjId: 'tl_obj_1' },
			})

			expect(commands).toHaveLength(1)
			expect(commands[0].timelineObjId).toBe('tl_obj_1')
			const cmd = commands[0].command as PresetCommand
			expect(cmd).toBeInstanceOf(PresetCommand)
			expect(cmd.operation).toBe(PresetOperation.Recall)
			expect(cmd.memoryNumber).toBe(3)
		})

		it('emits a PresetCommand when preset changes', () => {
			const commands = diffViscaStates(
				converter,
				{ preset: { value: 1, timelineObjId: 'old' } },
				{ preset: { value: 5, timelineObjId: 'new' } }
			)

			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as PresetCommand
			expect(cmd).toBeInstanceOf(PresetCommand)
			expect(cmd.operation).toBe(PresetOperation.Recall)
			expect(cmd.memoryNumber).toBe(5)
		})

		it('uses preset 0 correctly (boundary value)', () => {
			const commands = diffViscaStates(converter, getDefaultState(), { preset: { value: 0, timelineObjId: 'x' } })
			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as PresetCommand
			expect(cmd).toBeInstanceOf(PresetCommand)
			expect(cmd.operation).toBe(PresetOperation.Recall)
			expect(cmd.memoryNumber).toBe(0)
		})

		it('emits no command when preset value is unchanged', () => {
			const state: ViscaOverIpDeviceState = { preset: { value: 2, timelineObjId: 'x' } }
			expect(diffViscaStates(converter, state, { preset: { value: 2, timelineObjId: 'x2' } })).toHaveLength(0)
		})

		it('emits no command when preset disappears (layer goes empty - no resting state)', () => {
			expect(
				diffViscaStates(converter, { preset: { value: 3, timelineObjId: 'old' } }, getDefaultState())
			).toHaveLength(0)
		})
	})

	describe('PAN_TILT_SPEED', () => {
		// Mock multiplier is x10, so panSpeed=0.4 → 4, tiltSpeed=0.8 → 8.
		// If diffStates accidentally used zoom's x20, speed would be 8/16 - caught immediately.

		it('emits a PanTiltDriveCommand with direction and speeds from the pan/tilt converter (x10)', () => {
			const commands = diffViscaStates(converter, getDefaultState(), {
				panTiltSpeed: { value: { panSpeed: 0.4, tiltSpeed: -0.8 }, timelineObjId: 'pt1' },
			})

			expect(commands).toHaveLength(1)
			expect(commands[0].timelineObjId).toBe('pt1')
			const cmd = commands[0].command as PanTiltDriveCommand
			expect(cmd).toBeInstanceOf(PanTiltDriveCommand)
			expect(cmd.direction).toBe(PanTiltDirection.DownRight) // pan>0, tilt<0
			expect(cmd.panSpeed).toBe(4) // |0.4| x 10
			expect(cmd.tiltSpeed).toBe(8) // |−0.8| x 10
		})

		it('emits Stop direction and zero speeds when both are 0', () => {
			const commands = diffViscaStates(converter, getDefaultState(), {
				panTiltSpeed: { value: { panSpeed: 0, tiltSpeed: 0 }, timelineObjId: 'pt2' },
			})

			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as PanTiltDriveCommand
			expect(cmd).toBeInstanceOf(PanTiltDriveCommand)
			expect(cmd.direction).toBe(PanTiltDirection.Stop)
			expect(cmd.panSpeed).toBe(0)
			expect(cmd.tiltSpeed).toBe(0)
		})

		it('emits a command when only panSpeed changes', () => {
			const commands = diffViscaStates(
				converter,
				{ panTiltSpeed: { value: { panSpeed: 0, tiltSpeed: 0 }, timelineObjId: 'old' } },
				{ panTiltSpeed: { value: { panSpeed: 1, tiltSpeed: 0 }, timelineObjId: 'new' } }
			)
			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as PanTiltDriveCommand
			expect(cmd).toBeInstanceOf(PanTiltDriveCommand)
			expect(cmd.direction).toBe(PanTiltDirection.Right)
			expect(cmd.panSpeed).toBe(10) // |1| x 10
			expect(cmd.tiltSpeed).toBe(0)
		})

		it('emits a command when only tiltSpeed changes', () => {
			const commands = diffViscaStates(
				converter,
				{ panTiltSpeed: { value: { panSpeed: 0, tiltSpeed: 0 }, timelineObjId: 'old' } },
				{ panTiltSpeed: { value: { panSpeed: 0, tiltSpeed: -1 }, timelineObjId: 'new' } }
			)
			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as PanTiltDriveCommand
			expect(cmd).toBeInstanceOf(PanTiltDriveCommand)
			expect(cmd.direction).toBe(PanTiltDirection.Down)
			expect(cmd.panSpeed).toBe(0)
			expect(cmd.tiltSpeed).toBe(10) // |−1| x 10
		})

		it('emits no command when panTiltSpeed is unchanged', () => {
			const val = { panSpeed: 0.5, tiltSpeed: -0.5 }
			expect(
				diffViscaStates(
					converter,
					{ panTiltSpeed: { value: val, timelineObjId: 'a' } },
					{ panTiltSpeed: { value: { ...val }, timelineObjId: 'b' } }
				)
			).toHaveLength(0)
		})

		it('emits no command when panTiltSpeed disappears', () => {
			expect(
				diffViscaStates(
					converter,
					{ panTiltSpeed: { value: { panSpeed: 1, tiltSpeed: 0 }, timelineObjId: 'a' } },
					getDefaultState()
				)
			).toHaveLength(0)
		})
	})

	describe('ZOOM_SPEED', () => {
		// Mock multiplier is x20, so zoomSpeed=0.6 → 12.
		// If diffStates accidentally used pan/tilt's x10, speed would be 6 - caught immediately.

		it('emits a ZoomCommand with direction and speed from the zoom converter (x20)', () => {
			const commands = diffViscaStates(converter, getDefaultState(), { zoomSpeed: { value: 0.6, timelineObjId: 'z1' } })

			expect(commands).toHaveLength(1)
			expect(commands[0].timelineObjId).toBe('z1')
			const cmd = commands[0].command as ZoomCommand
			expect(cmd).toBeInstanceOf(ZoomCommand)
			expect(cmd.direction).toBe(ZoomDirection.TeleVariable) // speed > 0
			expect(cmd.speed).toBe(12) // |0.6| x 20
		})

		it('emits WideVariable when zooming in the negative direction', () => {
			const commands = diffViscaStates(converter, getDefaultState(), {
				zoomSpeed: { value: -0.5, timelineObjId: 'z2' },
			})

			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as ZoomCommand
			expect(cmd).toBeInstanceOf(ZoomCommand)
			expect(cmd.direction).toBe(ZoomDirection.WideVariable)
			expect(cmd.speed).toBe(10) // |−0.5| x 20
		})

		it('emits Stop when zoomSpeed is 0', () => {
			const commands = diffViscaStates(converter, getDefaultState(), { zoomSpeed: { value: 0, timelineObjId: 'z3' } })

			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as ZoomCommand
			expect(cmd).toBeInstanceOf(ZoomCommand)
			expect(cmd.direction).toBe(ZoomDirection.Stop)
			expect(cmd.speed).toBe(0)
		})

		it('emits a command when zoom direction reverses (tele → wide)', () => {
			const commands = diffViscaStates(
				converter,
				{ zoomSpeed: { value: 1, timelineObjId: 'old' } },
				{ zoomSpeed: { value: -1, timelineObjId: 'new' } }
			)
			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as ZoomCommand
			expect(cmd).toBeInstanceOf(ZoomCommand)
			expect(cmd.direction).toBe(ZoomDirection.WideVariable)
			expect(cmd.speed).toBe(20) // |−1| x 20
		})

		it('emits a command when zooming stops (non-zero → zero)', () => {
			const commands = diffViscaStates(
				converter,
				{ zoomSpeed: { value: 1, timelineObjId: 'old' } },
				{ zoomSpeed: { value: 0, timelineObjId: 'new' } }
			)
			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as ZoomCommand
			expect(cmd).toBeInstanceOf(ZoomCommand)
			expect(cmd.direction).toBe(ZoomDirection.Stop)
			expect(cmd.speed).toBe(0)
		})

		it('emits no command when zoomSpeed is unchanged', () => {
			expect(
				diffViscaStates(
					converter,
					{ zoomSpeed: { value: 0.5, timelineObjId: 'a' } },
					{ zoomSpeed: { value: 0.5, timelineObjId: 'b' } }
				)
			).toHaveLength(0)
		})

		it('emits no command when zoomSpeed disappears', () => {
			expect(
				diffViscaStates(converter, { zoomSpeed: { value: 1, timelineObjId: 'a' } }, getDefaultState())
			).toHaveLength(0)
		})
	})

	describe('FOCUS_SPEED', () => {
		// Mock multiplier is x30, so focusSpeed=0.3 → 9.
		// If diffStates accidentally used zoom's x20, speed would be 6 - caught immediately.

		it('emits a FocusCommand with direction and speed from the focus converter (x30)', () => {
			const commands = diffViscaStates(converter, getDefaultState(), {
				focusSpeed: { value: 0.3, timelineObjId: 'f1' },
			})

			expect(commands).toHaveLength(1)
			expect(commands[0].timelineObjId).toBe('f1')
			const cmd = commands[0].command as FocusCommand
			expect(cmd).toBeInstanceOf(FocusCommand)
			expect(cmd.direction).toBe(FocusDirection.FarVariable) // speed > 0
			expect(cmd.speed).toBe(9) // |0.3| x 30
		})

		it('emits NearVariable when focusing near', () => {
			const commands = diffViscaStates(converter, getDefaultState(), { focusSpeed: { value: -1, timelineObjId: 'f2' } })

			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as FocusCommand
			expect(cmd).toBeInstanceOf(FocusCommand)
			expect(cmd.direction).toBe(FocusDirection.NearVariable)
			expect(cmd.speed).toBe(30) // |−1| x 30
		})

		it('emits Stop when focusSpeed is 0', () => {
			const commands = diffViscaStates(converter, getDefaultState(), { focusSpeed: { value: 0, timelineObjId: 'f3' } })

			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as FocusCommand
			expect(cmd).toBeInstanceOf(FocusCommand)
			expect(cmd.direction).toBe(FocusDirection.Stop)
			expect(cmd.speed).toBe(0)
		})

		it('emits a command when focus direction reverses (far → near)', () => {
			const commands = diffViscaStates(
				converter,
				{ focusSpeed: { value: 0.5, timelineObjId: 'old' } },
				{ focusSpeed: { value: -0.5, timelineObjId: 'new' } }
			)
			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as FocusCommand
			expect(cmd).toBeInstanceOf(FocusCommand)
			expect(cmd.direction).toBe(FocusDirection.NearVariable)
			expect(cmd.speed).toBe(15) // |−0.5| x 30
		})

		it('emits a command when focus stops (non-zero → zero)', () => {
			const commands = diffViscaStates(
				converter,
				{ focusSpeed: { value: -1, timelineObjId: 'old' } },
				{ focusSpeed: { value: 0, timelineObjId: 'new' } }
			)
			expect(commands).toHaveLength(1)
			const cmd = commands[0].command as FocusCommand
			expect(cmd).toBeInstanceOf(FocusCommand)
			expect(cmd.direction).toBe(FocusDirection.Stop)
			expect(cmd.speed).toBe(0)
		})

		it('emits no command when focusSpeed is unchanged', () => {
			expect(
				diffViscaStates(
					converter,
					{ focusSpeed: { value: 0.5, timelineObjId: 'a' } },
					{ focusSpeed: { value: 0.5, timelineObjId: 'b' } }
				)
			).toHaveLength(0)
		})

		it('emits no command when focusSpeed disappears', () => {
			expect(
				diffViscaStates(converter, { focusSpeed: { value: 1, timelineObjId: 'a' } }, getDefaultState())
			).toHaveLength(0)
		})
	})

	it('emits two commands when two independent fields both change', () => {
		const commands = diffViscaStates(
			converter,
			{
				zoomSpeed: { value: 0.5, timelineObjId: 'z-old' },
				focusSpeed: { value: 0.5, timelineObjId: 'f-old' },
			},
			{
				zoomSpeed: { value: -0.5, timelineObjId: 'z-new' },
				focusSpeed: { value: -0.5, timelineObjId: 'f-new' },
			}
		)

		expect(commands).toHaveLength(2)
		const zoom = commands[0].command as ZoomCommand
		expect(zoom).toBeInstanceOf(ZoomCommand)
		expect(zoom.direction).toBe(ZoomDirection.WideVariable)
		expect(zoom.speed).toBe(10) // |−0.5| x 20
		const focus = commands[1].command as FocusCommand
		expect(focus).toBeInstanceOf(FocusCommand)
		expect(focus.direction).toBe(FocusDirection.NearVariable)
		expect(focus.speed).toBe(15) // |−0.5| x 30
	})

	it('emits a command when both panSpeed and tiltSpeed change from non-zero old values', () => {
		const commands = diffViscaStates(
			converter,
			{ panTiltSpeed: { value: { panSpeed: 1, tiltSpeed: 1 }, timelineObjId: 'old' } },
			{ panTiltSpeed: { value: { panSpeed: -1, tiltSpeed: -1 }, timelineObjId: 'new' } }
		)

		expect(commands).toHaveLength(1)
		const cmd = commands[0].command as PanTiltDriveCommand
		expect(cmd).toBeInstanceOf(PanTiltDriveCommand)
		expect(cmd.direction).toBe(PanTiltDirection.DownLeft) // pan<0, tilt<0
		expect(cmd.panSpeed).toBe(10) // |−1| x 10
		expect(cmd.tiltSpeed).toBe(10) // |−1| x 10
	})

	it('emits a command only for the field that changed, not the unchanged one', () => {
		const old: ViscaOverIpDeviceState = {
			preset: { value: 1, timelineObjId: 'a' },
			zoomSpeed: { value: 0.5, timelineObjId: 'b' },
		}
		const next: ViscaOverIpDeviceState = {
			preset: { value: 2, timelineObjId: 'c' }, // changed
			zoomSpeed: { value: 0.5, timelineObjId: 'd' }, // unchanged
		}

		const commands = diffViscaStates(converter, old, next)
		expect(commands).toHaveLength(1)
		const cmd = commands[0].command as PresetCommand
		expect(cmd).toBeInstanceOf(PresetCommand)
		expect(cmd.operation).toBe(PresetOperation.Recall)
		expect(cmd.memoryNumber).toBe(2)
	})

	it('emits all four commands when all fields appear at once', () => {
		const commands = diffViscaStates(converter, getDefaultState(), {
			preset: { value: 1, timelineObjId: 'p' },
			panTiltSpeed: { value: { panSpeed: 0.1, tiltSpeed: 0.2 }, timelineObjId: 'pt' },
			zoomSpeed: { value: 0.3, timelineObjId: 'z' },
			focusSpeed: { value: 0.4, timelineObjId: 'f' },
		})

		expect(commands).toHaveLength(4)
		expect(commands[0].command).toBeInstanceOf(PresetCommand)
		expect(commands[1].command).toBeInstanceOf(PanTiltDriveCommand)
		expect(commands[2].command).toBeInstanceOf(ZoomCommand)
		expect(commands[3].command).toBeInstanceOf(FocusCommand)
		expect((commands[0].command as PresetCommand).operation).toBe(PresetOperation.Recall)
		expect((commands[0].command as PresetCommand).memoryNumber).toBe(1)
		expect((commands[1].command as PanTiltDriveCommand).direction).toBe(PanTiltDirection.UpRight) // pan>0, tilt>0
		expect((commands[1].command as PanTiltDriveCommand).panSpeed).toBe(1) // |0.1| x 10
		expect((commands[1].command as PanTiltDriveCommand).tiltSpeed).toBe(2) // |0.2| x 10
		expect((commands[2].command as ZoomCommand).direction).toBe(ZoomDirection.TeleVariable) // speed > 0
		expect((commands[2].command as ZoomCommand).speed).toBe(6) // |0.3| x 20
		expect((commands[3].command as FocusCommand).direction).toBe(FocusDirection.FarVariable) // speed > 0
		expect((commands[3].command as FocusCommand).speed).toBe(12) // |0.4| x 30
	})
})
