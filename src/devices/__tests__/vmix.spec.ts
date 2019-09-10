import { setupVmixMock } from './vmixMock'
import { Conductor, DeviceContainer } from '../../conductor'
import {
	Mappings,
	DeviceType,
	MappingQuantel,
	QuantelTransitionType,
	MappingVMix
} from '../../types/src'
import { MockTime } from '../../__tests__/mockTime.spec'
import { ThreadedClass } from 'threadedclass'
import { QuantelDevice, QuantelCommandType } from '../quantel'
import { VMixDevice } from '../vmix'
require('../../__tests__/lib.spec')

const orgSetTimeout = setTimeout

async function t<A> (p: Promise<A>, mockTime, advanceTime: number = 50): Promise<A> {

	orgSetTimeout(() => {
		mockTime.advanceTimeTicks(advanceTime)
	},1)
	return p
}

/** Accepted deviance, accepted deviance in command timing during testing */
const ADEV = 30

describe('Quantel', () => {
	const {
		vmixServer,
		onRequest
	} = setupVmixMock()

	function clearMocks () {
		onRequest.mockClear()
	}

	let mockTime = new MockTime()
	beforeAll(() => {
		mockTime.mockDateNow()
	})
	beforeEach(() => {
		mockTime.init()

		clearMocks()
		vmixServer.repliesAreGood = true
		vmixServer.serverIsUp = true
	})
	test('Play and stop', async () => {
		let device
		let commandReceiver0 = jest.fn((...args) => {
			// pipe through the command
			return device._defaultCommandReceiver(...args)
		})

		let myLayerMapping0: MappingVMix = {
			device: DeviceType.VMIX,
			deviceId: 'myvmix'
		}
		let myLayerMapping: Mappings = {
			'myLayer0': myLayerMapping0
		}

		let myConductor = new Conductor({
			initializeAsClear: true,
			getCurrentTime: mockTime.getCurrentTime
		})
		let errorHandler = jest.fn((...args) => console.log('Error in device', ...args))
		myConductor.on('error', errorHandler)
		myConductor.on('commandError', errorHandler)

		await myConductor.init()

		await t(myConductor.addDevice('myvmix', {
			type: DeviceType.VMIX,
			options: {
				commandReceiver: commandReceiver0,
				host: '127.0.0.1',
				port: 9999
			}
		}), mockTime)

		let deviceContainer = myConductor.getDevice('myvmix')
		device = deviceContainer.device as ThreadedClass<VMixDevice>
		let deviceErrorHandler = jest.fn((...args) => console.log('Error in device', ...args))
		device.on('error', deviceErrorHandler)
		device.on('commandError', deviceErrorHandler)

		await myConductor.setMapping(myLayerMapping)

		expect(mockTime.getCurrentTime()).toEqual(10000)
		await mockTime.advanceTimeToTicks(10100)

		expect(commandReceiver0).toHaveBeenCalledTimes(2)
		expect(commandReceiver0).toHaveBeenNthCalledWith(1, expect.toBeCloseTo(10000, ADEV), expect.objectContaining({
			type: QuantelCommandType.SETUPPORT,
			time: 9990 // Because it was so close to currentTime, otherwise 9000
		}), expect.any(String), expect.any(String))
		expect(commandReceiver0).toHaveBeenNthCalledWith(2, expect.toBeCloseTo(10000, ADEV), expect.objectContaining({
			type: QuantelCommandType.CLEARCLIP,
			time: 10000
		}), expect.any(String), expect.any(String))

		expect(onRequest).toHaveBeenCalledTimes(7)

		// Connect to ISA
		expect(onRequest).toHaveBeenNthCalledWith(1, 'post', 'http://localhost:3000/connect/myISA%3A8000')
		// get initial server info
		expect(onRequest).toHaveBeenNthCalledWith(2, 'get', 'http://localhost:3000/default/server')

		// Set up port:
		// get server info
		expect(onRequest).toHaveBeenNthCalledWith(3, 'get', 'http://localhost:3000/default/server')
		// get port info
		expect(onRequest).toHaveBeenNthCalledWith(4, 'get', 'http://localhost:3000/default/server/1100/port/my_port')
		// delete the existing port
		expect(onRequest).toHaveBeenNthCalledWith(5, 'delete', 'http://localhost:3000/default/server/1100/port/my_port')
		// create new port and assign to channel
		expect(onRequest).toHaveBeenNthCalledWith(6, 'put', 'http://localhost:3000/default/server/1100/port/my_port/channel/2')
		// Reset the port
		expect(onRequest).toHaveBeenNthCalledWith(7, 'post', 'http://localhost:3000/default/server/1100/port/my_port/reset')

		clearMocks()
		commandReceiver0.mockClear()

		quantelServer.ignoreConnectivityCheck = true

		// Check that no commands has been scheduled:
		expect(await device.queue).toHaveLength(0)

		myConductor.timeline = [
			{
				id: 'video0',
				enable: {
					start: 11000,
					duration: 5000
				},
				layer: 'myLayer0',
				content: {
					deviceType: DeviceType.VMIX,

					title: 'myClip0'

					// seek?: number
					// inPoint?: number
					// length?: number
					// pauseTime?: number
					// playing?: boolean
					// noStarttime?: boolean
				}
			}
		]
		// Time to preload the clip
		await mockTime.advanceTimeToTicks(10990)

		expect(commandReceiver0).toHaveBeenCalledTimes(1)
		expect(commandReceiver0).toHaveBeenNthCalledWith(1, 10150, expect.objectContaining({
			type: QuantelCommandType.LOADCLIPFRAGMENTS
		}), expect.any(String), expect.any(String))

		expect(onRequest).toHaveBeenCalledTimes(6)

		// Search for and get clip info:
		expect(onRequest).toHaveBeenNthCalledWith(1, 'get', expect.stringContaining('/default/clip?Title=%22myClip0%22'))
		expect(onRequest).toHaveBeenNthCalledWith(2, 'get', expect.stringContaining('/default/clip/1337'))
		// Fetch fragments:
		expect(onRequest).toHaveBeenNthCalledWith(3, 'get', expect.stringContaining('clip/1337/fragments'))
		// get port info
		expect(onRequest).toHaveBeenNthCalledWith(4, 'get', expect.stringContaining('default/server/1100/port/my_port'))
		// Load fragments
		expect(onRequest).toHaveBeenNthCalledWith(5, 'post',expect.stringContaining('port/my_port/fragments'))
		// Prepare jump:
		expect(onRequest).toHaveBeenNthCalledWith(6, 'put',expect.stringContaining('port/my_port/jump?offset='))

		clearMocks()
		commandReceiver0.mockClear()

		// Time to start playing
		await mockTime.advanceTimeToTicks(11300)

		expect(commandReceiver0).toHaveBeenCalledTimes(1)
		expect(commandReceiver0).toHaveBeenNthCalledWith(1, 11000, expect.objectContaining({
			type: QuantelCommandType.PLAYCLIP
		}), expect.any(String), expect.any(String))

		expect(onRequest).toHaveBeenCalledTimes(3)

		// Trigger Jump
		// expect(onRequest).toHaveBeenNthCalledWith(1, 'post', expect.stringContaining('/default/server/1100/port/my_port/trigger/JUMP'))
		// Trigger play
		expect(onRequest).toHaveBeenNthCalledWith(1, 'post', expect.stringContaining('/default/server/1100/port/my_port/trigger/START'))
		// Check that play worked
		expect(onRequest).toHaveBeenNthCalledWith(2, 'get', expect.stringContaining('default/server/1100/port/my_port'))
		// Plan to stop at end of clip
		expect(onRequest).toHaveBeenNthCalledWith(3, 'post', expect.stringContaining('/default/server/1100/port/my_port/trigger/STOP?offset=1999'))

		clearMocks()
		commandReceiver0.mockClear()

		// Time to stop playing
		await mockTime.advanceTimeToTicks(16050)
		expect(commandReceiver0).toHaveBeenCalledTimes(1)
		expect(commandReceiver0).toHaveBeenNthCalledWith(1, 16000, expect.objectContaining({
			type: QuantelCommandType.CLEARCLIP
		}), expect.any(String), expect.any(String))

		expect(onRequest).toHaveBeenCalledTimes(1)
		// Clear port from clip (reset port)
		expect(onRequest).toHaveBeenNthCalledWith(1, 'post', expect.stringContaining('port/my_port/reset'))

		await myConductor.destroy()

		expect(errorHandler).toHaveBeenCalledTimes(0)
		expect(deviceErrorHandler).toHaveBeenCalledTimes(0)
	})
})
