import type { DeviceEntry } from 'timeline-state-resolver-api'
import { getDeviceContext } from '../../integrations/__tests__/testlib.js'
import { builtinDeviceManifest } from '../../manifest.js'
import { DevicesDict } from '../devices.js'

describe('Ensure that all integrations have defined their actions', () => {
	for (const [key, device] of Object.entries<DeviceEntry>(DevicesDict)) {
		test(`Device ${key}`, () => {
			const deviceManifest = builtinDeviceManifest.subdevices[key]
			expect(deviceManifest).toBeTruthy()

			const deviceInstance = new device.deviceClass(getDeviceContext())
			expect(deviceInstance).toBeTruthy()

			if (!deviceManifest.actions) return

			for (const action of deviceManifest.actions) {
				// check that the action is defined on the device:
				const fcn = deviceInstance.actions[action.id]
				try {
					expect(fcn).toBeTruthy()
					expect(typeof fcn).toBe('function')
				} catch (e) {
					if (e instanceof Error) {
						e.message = `Action "${action.id}": ${e.message}`
					}
					throw e
				}
			}
		})
	}
})
