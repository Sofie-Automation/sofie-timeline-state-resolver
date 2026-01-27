import { DeviceContextAPI } from 'timeline-state-resolver-api'

/** A default context for devices used in unit tests */

export function getDeviceContext(): DeviceContextAPI<any, any> {
	return {
		logger: {
			error: jest.fn(),
			warning: jest.fn(),
			info: jest.fn(),
			debug: jest.fn(),
		},
		getCurrentTime: jest.fn(() => Date.now()),
		emitDebugState: jest.fn(),
		connectionChanged: jest.fn(),
		resetResolver: jest.fn(),
		commandError: jest.fn(),
		updateMediaObject: jest.fn(),
		clearMediaObjects: jest.fn(),
		timeTrace: jest.fn(),
		resetState: jest.fn(async () => Promise.resolve()),
		resetToState: jest.fn(async () => Promise.resolve()),
		recalcDiff: jest.fn(),
		setAddressState: jest.fn(),
		getCurrentState: jest.fn(() => undefined),
	}
}
