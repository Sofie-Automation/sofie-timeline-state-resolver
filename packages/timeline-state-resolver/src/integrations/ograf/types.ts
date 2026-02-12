import type { CommandWithContext } from 'timeline-state-resolver-api'

export type OGrafDeviceCommand = CommandWithContext<OGrafDeviceCmd, string>

export type OGrafDeviceCmd =
	| {
			layerId: string
			commandName: 'clear'
			rendererId: string
			renderTarget: string
			graphicId: string
	  }
	| {
			layerId: string
			commandName: 'load'
			rendererId: string
			renderTarget: string
			graphicId: string

			data: unknown
	  }
	| {
			layerId: string
			commandName: 'update'
			rendererId: string
			renderTarget: string
			graphicId: string

			data: unknown
			skipAnimation?: boolean
	  }
	| {
			layerId: string
			commandName: 'play'
			rendererId: string
			renderTarget: string
			graphicId: string

			delta?: number
			goto?: number
			skipAnimation?: boolean
	  }
	| {
			layerId: string
			commandName: 'stop'
			rendererId: string
			renderTarget: string
			graphicId: string

			skipAnimation?: boolean
	  }
	| {
			layerId: string
			commandName: 'customAction'
			rendererId: string
			renderTarget: string
			graphicId: string

			actionId: string
			payload: unknown
			skipAnimation?: boolean
	  }
	| {
			layerId: string
			commandName: 'rendererCustomAction'
			rendererId: string

			actionId: string
			payload: unknown
			skipAnimation?: boolean
	  }
