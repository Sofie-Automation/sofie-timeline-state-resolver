import {
	ActionExecutionResult,
	ActionExecutionResultCode,
	OgrafOptions,
	StatusCode,
	TSRTimelineContent,
	Timeline,
	OgrafDeviceTypes,
	DeviceStatus,
	OgrafActionMethods,
	OgrafActions,
	Mapping,
	DeltaStepPayload,
	GotoStepPayload,
	CustomActionPayload,
	RendererCustomActionPayload,
} from 'timeline-state-resolver-types'
import type { Device, DeviceContextAPI } from 'timeline-state-resolver-api'
import got, { GotRequestFunction } from 'got'
import { assertNever } from '../../lib'
import { convertTimelineStateToDeviceState, diffStates, OGrafDeviceState } from './ografState'
import { OGrafDeviceCommand } from './types'

interface TrackedLayer {
	graphicInstanceId: string
}
export class OGrafDevice implements Device<OgrafDeviceTypes, OGrafDeviceState, OGrafDeviceCommand> {
	/** Setup in init */
	protected options!: OgrafOptions
	/** Maps layers -> sent command-hashes */
	protected trackedLayers: {
		[layerId: string]: TrackedLayer | undefined
	} = {}

	protected _terminated = false

	constructor(protected context: DeviceContextAPI<OGrafDeviceState>) {
		// Nothing
	}

	async init(options: OgrafOptions): Promise<boolean> {
		this.options = options
		return true
	}
	async terminate(): Promise<void> {
		// this.trackedState.clear()
		this._terminated = true
	}

	get connected(): boolean {
		return false
	}
	getStatus(): Omit<DeviceStatus, 'active'> {
		return {
			statusCode: StatusCode.GOOD,
			messages: [],
		}
	}
	readonly actions: OgrafActionMethods = {
		[OgrafActions.Resync]: async () => this.executeResyncAction(),
		[OgrafActions.DeltaStep]: async (params) => this.executeDeltaStepAction(params),
		[OgrafActions.GotoStep]: async (params) => this.executeGotoStepAction(params),
		[OgrafActions.CustomAction]: async (params) => this.executeCustomAction(params),
		[OgrafActions.RendererCustomAction]: async (params) => this.executeRendererCustomAction(params),
	}

	private async executeResyncAction(): Promise<ActionExecutionResult<undefined>> {
		this.context.resetResolver()
		return { result: ActionExecutionResultCode.Ok }
	}
	private async executeDeltaStepAction(params: DeltaStepPayload): Promise<ActionExecutionResult<undefined>> {
		await this.sendCommand({
			timelineObjId: '',
			context: '',
			command: {
				commandName: 'play',
				rendererId: params.rendererId,
				renderTarget: params.renderTarget,
				graphicId: params.graphicId,
				layerId: `__execute_action_${params.rendererId}_${params.renderTarget}_${params.graphicId}`,

				delta: params.delta,
				skipAnimation: params.skipAnimation,
			},
		})
		return { result: ActionExecutionResultCode.Ok }
	}
	private async executeGotoStepAction(params: GotoStepPayload): Promise<ActionExecutionResult<undefined>> {
		await this.sendCommand({
			timelineObjId: '',
			context: '',
			command: {
				commandName: 'play',
				rendererId: params.rendererId,
				renderTarget: params.renderTarget,
				graphicId: params.graphicId,
				layerId: `__execute_action_${params.rendererId}_${params.renderTarget}_${params.graphicId}`,

				goto: params.gotoStep,
				skipAnimation: params.skipAnimation,
			},
		})
		return { result: ActionExecutionResultCode.Ok }
	}
	private async executeCustomAction(params: CustomActionPayload): Promise<ActionExecutionResult<undefined>> {
		await this.sendCommand({
			timelineObjId: '',
			context: '',
			command: {
				commandName: 'customAction',
				rendererId: params.rendererId,
				renderTarget: params.renderTarget,
				graphicId: params.graphicId,
				layerId: `__execute_action_${params.rendererId}_${params.renderTarget}_${params.graphicId}`,

				actionId: params.actionId,
				payload: params.payload,
				skipAnimation: params.skipAnimation,
			},
		})
		return { result: ActionExecutionResultCode.Ok }
	}
	private async executeRendererCustomAction(
		params: RendererCustomActionPayload
	): Promise<ActionExecutionResult<undefined>> {
		await this.sendCommand({
			timelineObjId: '',
			context: '',
			command: {
				commandName: 'rendererCustomAction',
				rendererId: params.rendererId,
				layerId: `__execute_action_${params.rendererId}`,

				actionId: params.actionId,
				payload: params.payload,
				// skipAnimation: params.skipAnimation,
			},
		})
		return { result: ActionExecutionResultCode.Ok }
	}

	convertTimelineStateToDeviceState(
		state: Timeline.TimelineState<TSRTimelineContent>,
		mappings: Record<string, Mapping<OgrafDeviceTypes['Mappings']>>
	): OGrafDeviceState {
		const ografState = convertTimelineStateToDeviceState(state, mappings)
		// console.log('state', state)
		// console.log('mappings', mappings)
		// console.log('ografState', ografState)
		return ografState
	}
	diffStates(oldState: OGrafDeviceState | undefined, newState: OGrafDeviceState): OGrafDeviceCommand[] {
		// console.log('diffStates------------')
		// console.log('oldState', JSON.stringify(oldState, null, 2))
		// console.log('newState', JSON.stringify(newState, null, 2))
		const commands = diffStates(oldState, newState)
		// console.log('commands', commands)
		return commands
	}
	async sendCommand(cmd: OGrafDeviceCommand): Promise<void> {
		const c = cmd.command
		// console.log('sendCommand', c)
		if (c.commandName === 'clear') {
			const trackedLayer = await this.getTrackedLayer(c)
			if (!trackedLayer) {
				this.context.commandError(new Error(`No tracked layer found`), cmd)
				return
			}

			if (trackedLayer) {
				// Clear that specific graphicsInstance:
				await this.sendHTTP(
					'put',
					`/renderers/${c.rendererId}/target/graphic/clear`,
					{},
					{
						filters: {
							renderTarget: this.formatRenderTarget(c.renderTarget),
							graphicInstanceId: trackedLayer.graphicInstanceId,
						},
					}
				)
				this.trackedLayers[c.layerId] = undefined
			} else {
				// Fall back to clearing the whole RenderTarget:
				await this.sendHTTP(
					'put',
					`/renderers/${c.rendererId}/target/graphic/clear`,
					{},
					{
						filters: {
							renderTarget: this.formatRenderTarget(c.renderTarget),
						},
					}
				)
			}
		} else if (c.commandName === 'load') {
			const response = await this.sendHTTP(
				'put',
				`/renderers/${c.rendererId}/target/graphic/load`,
				{
					renderTarget: c.renderTarget,
				},
				{
					graphicId: c.graphicId,
					params: {
						data: c.data,
					},
				}
			)

			if (response.statusCode >= 200 || response.statusCode <= 299) {
				const json = JSON.parse(response.body)

				// Track the returned GraphicInstanceId for later:
				this.trackedLayers[c.layerId] = { graphicInstanceId: json.graphicInstanceId }
			} else {
				this.context.commandError(new Error(`Error in reply: ${response.body}`), cmd)
			}
		} else if (c.commandName === 'play') {
			const trackedLayer = await this.getTrackedLayer(c)
			if (!trackedLayer) {
				this.context.commandError(new Error(`No tracked layer found`), cmd)
				return
			}

			const response = await this.sendHTTP(
				'post',
				`/renderers/${c.rendererId}/target/graphic/playAction`,
				{
					renderTarget: c.renderTarget,
					graphicTarget: JSON.stringify({
						graphicInstanceId: trackedLayer.graphicInstanceId,
					}),
				},
				{
					params: {
						delta: c.delta,
						goto: c.goto,
						skipAnimation: c.skipAnimation,
					},
				}
			)
			if (response.statusCode >= 300) {
				this.context.commandError(new Error(`Error in reply: ${response.body}`), cmd)
			}
		} else if (c.commandName === 'update') {
			const trackedLayer = await this.getTrackedLayer(c)
			if (!trackedLayer) {
				this.context.commandError(new Error(`No tracked layer found`), cmd)
				return
			}

			const response = await this.sendHTTP(
				'post',
				`/renderers/${c.rendererId}/target/graphic/updateAction`,
				{
					renderTarget: c.renderTarget,
					graphicTarget: JSON.stringify({
						graphicInstanceId: trackedLayer.graphicInstanceId,
					}),
				},
				{
					params: {
						data: c.data,
						skipAnimation: c.skipAnimation,
					},
				}
			)
			if (response.statusCode >= 300) {
				this.context.commandError(new Error(`Error in reply: ${response.body}`), cmd)
			}
		} else if (c.commandName === 'stop') {
			const trackedLayer = await this.getTrackedLayer(c)
			if (!trackedLayer) {
				this.context.commandError(new Error(`No tracked layer found`), cmd)
				return
			}

			const response = await this.sendHTTP(
				'post',
				`/renderers/${c.rendererId}/target/graphic/stopAction`,
				{
					renderTarget: c.renderTarget,
					graphicTarget: JSON.stringify({
						graphicInstanceId: trackedLayer.graphicInstanceId,
					}),
				},
				{
					params: {
						skipAnimation: c.skipAnimation,
					},
				}
			)
			if (response.statusCode >= 300) {
				this.context.commandError(new Error(`Error in reply: ${response.body}`), cmd)
			}
		} else if (c.commandName === 'customAction') {
			const trackedLayer = await this.getTrackedLayer(c)
			if (!trackedLayer) {
				this.context.commandError(new Error(`No tracked layer found`), cmd)
				return
			}

			const response = await this.sendHTTP(
				'post',
				`/renderers/${c.rendererId}/target/graphic/customAction`,
				{
					renderTarget: c.renderTarget,
					graphicTarget: JSON.stringify({
						graphicInstanceId: trackedLayer.graphicInstanceId,
					}),
				},
				{
					params: {
						id: c.actionId,
						payload: c.payload,
						skipAnimation: c.skipAnimation,
					},
				}
			)
			if (response.statusCode >= 300) {
				this.context.commandError(new Error(`Error in reply: ${response.body}`), cmd)
			}
		} else if (c.commandName === 'rendererCustomAction') {
			const response = await this.sendHTTP(
				'post',
				`/renderers/${c.rendererId}/customActions/${c.actionId}`,
				{},
				{
					payload: c.payload,
				}
			)
			if (response.statusCode >= 300) {
				this.context.commandError(new Error(`Error in reply: ${response.body}`), cmd)
			}
		} else {
			assertNever(c)
		}
	}
	private async sendHTTP(
		method: 'get' | 'post' | 'put',
		url: string,
		queryParams: { [key: string]: string },
		bodyJSON: { [key: string]: any }
	) {
		let fcn: GotRequestFunction | undefined = undefined
		if (method === 'get') fcn = got.get
		else if (method === 'post') fcn = got.post
		else if (method === 'put') fcn = got.put
		else {
			assertNever(method)
			throw new Error(`Internal error, method: ${method}`)
		}

		const fullUrl = this.getURL(url, queryParams)
		// console.log(method, fullUrl, bodyJSON)

		const response = await fcn(fullUrl, {
			json: bodyJSON,
			throwHttpErrors: false,
		})
		// console.log('REPLY', response.statusCode, response.body)
		return response
	}
	private getURL(localUrl: string, queryParams: { [key: string]: string } = {}): string {
		const url = new URL(`/ograf/v1${localUrl}`, this.options.url)
		for (const [key, value] of Object.entries<string>(queryParams ?? {})) {
			url.searchParams.append(key, value)
		}

		return url.toString()
	}
	private formatRenderTarget(renderTarget: string): any {
		if (renderTarget.startsWith('{')) {
			return JSON.parse(renderTarget)
		}
		return renderTarget
	}
	private async getTrackedLayer(o: {
		layerId: string
		rendererId: string
		renderTarget: string
		graphicId: string
	}): Promise<TrackedLayer | undefined> {
		const trackedLayer = this.trackedLayers[o.layerId]
		if (trackedLayer) return trackedLayer

		// Look up the current state on the server:
		const response = await this.sendHTTP(
			'get',
			`/renderers/${o.rendererId}/target`,
			{
				renderTarget: o.renderTarget,
			},
			{}
		)
		if (response.statusCode === 200) {
			const json = JSON.parse(response.body)
			if (json.graphicInstances) {
				for (const graphicInstance of json.graphicInstances) {
					if (graphicInstance.graphic.id === o.graphicId) {
						const newTrackedLayer = {
							graphicInstanceId: graphicInstance.graphicInstanceId,
						}
						this.trackedLayers[o.layerId] = newTrackedLayer
						return newTrackedLayer
					}
				}
			}
		}
		return undefined
	}
}
