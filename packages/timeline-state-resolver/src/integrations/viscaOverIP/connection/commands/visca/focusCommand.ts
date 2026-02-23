import { FocusDirection } from '../../enums.js'
import { ViscaCommand } from '../abstractCommand.js'

export class FocusCommand extends ViscaCommand {
	constructor(
		readonly direction: FocusDirection,
		readonly speed: number = 0
	) {
		super()
	}

	serialize() {
		let data = this.direction

		if (data > FocusDirection.NearStandard) data = data + this.speed

		return Buffer.from([0x81, 0x01, 0x04, 0x08, data, 0xff])
	}
}
