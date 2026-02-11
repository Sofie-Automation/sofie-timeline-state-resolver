import { FocusMode } from '../../enums.js'
import { ViscaInquiryCommand } from '../abstractCommand.js'

export class FocusModeInquiryCommand extends ViscaInquiryCommand {
	serialize() {
		return Buffer.from([0x81, 0x09, 0x04, 0x38, 0xff])
	}

	deserializeReply(payload: Buffer): FocusMode {
		return payload[2]
	}
}
