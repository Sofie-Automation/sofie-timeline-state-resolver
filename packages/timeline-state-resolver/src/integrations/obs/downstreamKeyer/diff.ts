import type { OBSCommandWithContextTyped } from '..'
import type { OBSDeviceState } from '../state'
import { literal } from '../../../lib'
import { DSK_VENDOR_NAME } from './types'
import type { OBSDownstreamKeyerCache } from './types'

export function diffDownstreamKeyer(
	oldState: OBSDeviceState,
	newState: OBSDeviceState,
	cache?: OBSDownstreamKeyerCache
): Array<OBSCommandWithContextTyped<'CallVendorRequest'>> {
	const commands: Array<OBSCommandWithContextTyped<'CallVendorRequest'>> = []

	const desiredScene = newState.dsk?.selectedScene
	if (!desiredScene) return commands

	const oldScene = oldState.dsk?.selectedScene
	if (oldScene === desiredScene) return commands

	const ensureInDskList = newState.dsk?.ensureInDskList ?? true
	const shouldAdd = ensureInDskList && (!cache || !cache.scenes.has(desiredScene))

	if (shouldAdd) {
		commands.push(
			literal<OBSCommandWithContextTyped<'CallVendorRequest'>>({
				command: {
					requestName: 'CallVendorRequest',
					args: {
						vendorName: DSK_VENDOR_NAME,
						requestType: 'dsk_add_scene',
						requestData: { scene: desiredScene },
					},
				},
				context: `dsk add scene "${desiredScene}"`,
				timelineObjId: '',
			})
		)
	}

	commands.push(
		literal<OBSCommandWithContextTyped<'CallVendorRequest'>>({
			command: {
				requestName: 'CallVendorRequest',
				args: {
					vendorName: DSK_VENDOR_NAME,
					requestType: 'dsk_select_scene',
					requestData: { scene: desiredScene },
				},
			},
			context: `dsk select scene changed from "${oldScene}" to "${desiredScene}"`,
			timelineObjId: '',
		})
	)

	return commands
}

