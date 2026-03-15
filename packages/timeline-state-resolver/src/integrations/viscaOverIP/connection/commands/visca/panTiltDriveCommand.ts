import { ViscaCommand } from '../abstractCommand.js'
import { PanTiltDirection } from '../../enums.js'

export class PanTiltDriveCommand extends ViscaCommand {
	constructor(
		readonly direction: PanTiltDirection,
		readonly panSpeed: number = 0,
		readonly tiltSpeed: number = 0
	) {
		super()
	}

	serialize() {
		const buffer = Buffer.alloc(4)

		buffer.writeUInt8(this.panSpeed, 0)
		buffer.writeUInt8(this.tiltSpeed, 1)
		buffer.writeUInt16BE(this.direction, 2)

		return Buffer.from([0x81, 0x01, 0x06, 0x01, ...buffer, 0xff])
	}
}
