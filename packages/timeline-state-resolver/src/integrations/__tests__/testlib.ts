import { mockDeep, MockProxy } from 'jest-mock-extended'
import { DeviceContextAPI } from 'timeline-state-resolver-api'

/** A default context for devices used in unit tests */

export function getDeviceContext(): MockProxy<DeviceContextAPI<any, any>> {
	// only properties (functions) needing a specific default (return) value, incl. async ones need to be explicitly set in the first arg
	return mockDeep<DeviceContextAPI<any, any>>({
		deviceName: 'Test Device',
		getCurrentTime: () => Date.now(),
	})
}
