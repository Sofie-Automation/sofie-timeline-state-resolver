import { ViscaDeviceSettingCommand } from '../abstractCommand.js'

/** The IF_Clear command - VISCA device setting command (type 0x0120), payload 8X 01 00 01 FF where X=1 for VISCA over IP */
export class ResetSequenceNumberCommand extends ViscaDeviceSettingCommand {
	serialize() {
		return Buffer.from([0x81, 0x01, 0x00, 0x01, 0xff])
	}
}
