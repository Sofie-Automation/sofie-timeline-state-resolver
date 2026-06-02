import { EventEmitter } from 'events'

export class VindralComposer extends EventEmitter {
	connect = jest.fn().mockResolvedValue(undefined)
	disconnect = jest.fn()
	removeAllListeners = jest.fn()
	triggerConnector = jest.fn()
	triggerConnectorByValue = jest.fn()
	setLayerSource = jest.fn()
	executeScriptFunction = jest.fn()
}
