import { ViscaCommand } from '../abstractCommand.js'
import { ZoomDirection } from '../../enums.js'

export class ZoomCommand extends ViscaCommand {
	constructor(
		readonly direction: ZoomDirection,
		readonly speed: number = 0
	) {
		super()
	}

	serialize() {
		let data = this.direction

		if (data > ZoomDirection.WideStandard) data = data + this.speed

		return Buffer.from([0x81, 0x01, 0x04, 0x07, data, 0xff])
	}
}
