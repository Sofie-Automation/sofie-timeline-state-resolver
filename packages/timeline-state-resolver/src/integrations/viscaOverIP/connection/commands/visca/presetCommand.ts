import { ViscaCommand } from '../abstractCommand.js'
import { PresetOperation } from '../../enums.js'

export class PresetCommand extends ViscaCommand {
	constructor(
		readonly operation: PresetOperation,
		readonly memoryNumber: number
	) {
		super()
	}
	serialize() {
		return Buffer.from([0x81, 0x01, 0x04, 0x3f, this.operation, this.memoryNumber, 0xff])
	}
}
