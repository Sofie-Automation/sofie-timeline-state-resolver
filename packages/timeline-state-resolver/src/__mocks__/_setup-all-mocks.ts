import * as atemConnection from './atem-connection.js'
import * as casparcgConnection from './casparcg-connection.js'
import * as emberplusConnection from './emberplus-connection.js'
import * as emberplus from './emberplus.js'
import * as got from './got.js'
import * as hyperdeckConnection from './hyperdeck-connection.js'
import * as net from './net.js'
import * as osc from './osc.js'
import * as vConnection from './v-connection.js'
import * as ws from './ws.js'

// Note: Due to the nature of threadedClass, jests' normal module-mocks
// (just adding the mock-file in an adjecent __mocks__ directory)
// does not work properly and need to be set up like this..

export function setupAllMocks() {
	jest.mock('atem-connection', () => atemConnection)
	jest.mock('casparcg-connection', () => casparcgConnection)
	jest.mock('emberplus-connection', () => emberplusConnection)
	jest.mock('emberplus', () => emberplus)
	jest.mock('got', () => got)
	jest.mock('hyperdeck-connection', () => hyperdeckConnection)
	jest.mock('net', () => net)
	jest.mock('osc', () => osc)
	jest.mock('@tv2media/v-connection', () => vConnection)
	jest.mock('ws', () => ws)
}
