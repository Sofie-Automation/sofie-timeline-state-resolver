import {
	ActionExecutionResult,
	ActionExecutionResultCode,
	OgrafOptions,
	StatusCode,
	TSRTimelineContent,
	OgrafDeviceTypes,
	DeviceStatus,
	OgrafActionMethods,
	OgrafActions,
	DeltaStepPayload,
	GotoStepPayload,
	CustomActionPayload,
	RendererCustomActionPayload,
	Mappings,
	ITranslatableMessage,
	ClearGraphicsPayload,
} from 'timeline-state-resolver-types'
import type { Device, DeviceContextAPI, DeviceTimelineState } from 'timeline-state-resolver-api'
import type * as OGraf from 'ograf'
import { assertNever, t } from '../../lib.js'
import { convertTimelineStateToDeviceState, diffStates, OGrafDeviceState } from './ografState.js'
import { OGrafDeviceCommand } from './types.js'
import { OgrafApi } from './ografApi.js'

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

	private ografApi: OgrafApi = OgrafApi.getSingleton()

	protected _terminated = false

	constructor(protected context: DeviceContextAPI<OGrafDeviceState>) {
		// Nothing
	}

	async init(options: OgrafOptions): Promise<boolean> {
		this.options = options

		this.ografApi.baseURL = options.url

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
		[OgrafActions.ClearGraphics]: async (params) => this.executeClearGraphics(params),
		[OgrafActions.DeltaStep]: async (params) => this.executeDeltaStepAction(params),
		[OgrafActions.GotoStep]: async (params) => this.executeGotoStepAction(params),
		[OgrafActions.CustomAction]: async (params) => this.executeCustomAction(params),
		[OgrafActions.RendererCustomAction]: async (params) => this.executeRendererCustomAction(params),
	}

	private async executeResyncAction(): Promise<ActionExecutionResult<undefined>> {
		this.context.resetResolver()
		return { result: ActionExecutionResultCode.Ok }
	}
	private async executeClearGraphics(params: ClearGraphicsPayload): Promise<ActionExecutionResult<undefined>> {
		const filter: OGraf.ServerApi.components['schemas']['GraphicFilter'][][0] = {}
		if (params.renderTarget) {
			filter.renderTarget = this.formatRenderTarget(params.renderTarget)
		}
		if (params.graphicId) {
			filter.graphicId = params.graphicId
		}
		if (params.graphicInstanceId) {
			filter.graphicInstanceId = params.graphicInstanceId
		}

		return this.handleResponse(
			await this.ografApi.renderTargetGraphicClear(
				{
					rendererId: params.rendererId,
				},
				{
					renderTarget: params.renderTarget,
					filters: [filter],
				}
			)
		)
	}
	private async executeDeltaStepAction(params: DeltaStepPayload): Promise<ActionExecutionResult<undefined>> {
		const graphicInstanceId = await this.getGraphicsInstanceId(params)
		if (!graphicInstanceId) return { result: ActionExecutionResultCode.Error, response: t('No Graphic found') }

		return this.handleResponse(
			await this.ografApi.renderTargetGraphicPlay(
				{
					rendererId: params.rendererId,
				},
				{
					renderTarget: params.renderTarget,
					graphicInstanceId: graphicInstanceId,
					params: {
						delta: params.delta,
						skipAnimation: params.skipAnimation,
					},
				}
			)
		)
	}

	private async executeGotoStepAction(params: GotoStepPayload): Promise<ActionExecutionResult<undefined>> {
		const graphicInstanceId = await this.getGraphicsInstanceId(params)
		if (!graphicInstanceId) return { result: ActionExecutionResultCode.Error, response: t('No Graphic found') }

		return this.handleResponse(
			await this.ografApi.renderTargetGraphicPlay(
				{
					rendererId: params.rendererId,
				},
				{
					renderTarget: params.renderTarget,
					graphicInstanceId: graphicInstanceId,
					params: {
						goto: params.gotoStep,
						skipAnimation: params.skipAnimation,
					},
				}
			)
		)
	}
	private async executeCustomAction(params: CustomActionPayload): Promise<ActionExecutionResult<undefined>> {
		const graphicInstanceId = await this.getGraphicsInstanceId(params)
		if (!graphicInstanceId) return { result: ActionExecutionResultCode.Error, response: t('No Graphic found') }

		return this.handleResponse(
			await this.ografApi.renderTargetGraphicInvokeCustomAction(
				{
					rendererId: params.rendererId,
					customActionId: params.actionId,
				},
				{
					renderTarget: params.renderTarget,
					graphicInstanceId: graphicInstanceId,
					params: {
						payload: params.payload,
						skipAnimation: params.skipAnimation,
					},
				}
			)
		)
	}
	private async executeRendererCustomAction(
		params: RendererCustomActionPayload
	): Promise<ActionExecutionResult<undefined>> {
		return this.handleResponse(
			await this.ografApi.rendererInvokeCustomAction(
				{
					rendererId: params.rendererId,
					customActionId: params.actionId,
				},
				{
					payload: params.payload,
					skipAnimation: params.skipAnimation,
				}
			)
		)
	}

	convertTimelineStateToDeviceState(
		state: DeviceTimelineState<TSRTimelineContent>,
		newMappings: Mappings
	): OGrafDeviceState {
		const ografState = convertTimelineStateToDeviceState(state, newMappings)
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
				await this.ografApi.renderTargetGraphicClear(
					{ rendererId: c.rendererId },
					{
						filters: [
							{
								renderTarget: this.formatRenderTarget(c.renderTarget),
								graphicInstanceId: trackedLayer.graphicInstanceId,
							},
						],
					}
				)

				this.trackedLayers[c.layerId] = undefined
			} else {
				// Fall back to clearing the whole RenderTarget:
				await this.ografApi.renderTargetGraphicClear(
					{ rendererId: c.rendererId },
					{
						filters: [{ renderTarget: this.formatRenderTarget(c.renderTarget) }],
					}
				)
			}
		} else if (c.commandName === 'load') {
			const response = await this.ografApi.renderTargetGraphicLoad(
				{
					rendererId: c.rendererId,
				},
				{
					graphicId: c.graphicId,
					renderTarget: this.formatRenderTarget(c.renderTarget),
					params: {
						data: c.data,
					},
				}
			)

			if (response.status === 200) {
				// Track the returned GraphicInstanceId for later:
				this.trackedLayers[c.layerId] = { graphicInstanceId: response.content.graphicInstanceId }
			} else {
				this.context.commandError(new Error(`Error in reply: ${JSON.stringify(response.content)}`), cmd)
			}
		} else if (c.commandName === 'play') {
			const trackedLayer = await this.getTrackedLayer(c)
			if (!trackedLayer) {
				this.context.commandError(new Error(`No tracked layer found`), cmd)
				return
			}

			const response = await this.ografApi.renderTargetGraphicPlay(
				{
					rendererId: c.rendererId,
				},
				{
					renderTarget: this.formatRenderTarget(c.renderTarget),
					graphicInstanceId: trackedLayer.graphicInstanceId,
					params: {
						delta: c.delta,
						goto: c.goto,
						skipAnimation: c.skipAnimation,
					},
				}
			)

			if (response.status !== 200) {
				this.context.commandError(new Error(`Error in reply: ${JSON.stringify(response.content)}`), cmd)
			}
		} else if (c.commandName === 'update') {
			const trackedLayer = await this.getTrackedLayer(c)
			if (!trackedLayer) {
				this.context.commandError(new Error(`No tracked layer found`), cmd)
				return
			}

			const response = await this.ografApi.renderTargetGraphicUpdate(
				{
					rendererId: c.rendererId,
				},
				{
					renderTarget: this.formatRenderTarget(c.renderTarget),
					graphicInstanceId: trackedLayer.graphicInstanceId,
					params: {
						data: c.data,
						skipAnimation: c.skipAnimation,
					},
				}
			)
			if (response.status !== 200) {
				this.context.commandError(new Error(`Error in reply: ${JSON.stringify(response.content)}`), cmd)
			}
		} else if (c.commandName === 'stop') {
			const trackedLayer = await this.getTrackedLayer(c)
			if (!trackedLayer) {
				this.context.commandError(new Error(`No tracked layer found`), cmd)
				return
			}

			const response = await this.ografApi.renderTargetGraphicStop(
				{
					rendererId: c.rendererId,
				},
				{
					graphicInstanceId: trackedLayer.graphicInstanceId,
					renderTarget: this.formatRenderTarget(c.renderTarget),
					params: {
						skipAnimation: c.skipAnimation,
					},
				}
			)
			if (response.status !== 200) {
				this.context.commandError(new Error(`Error in reply: ${JSON.stringify(response.content)}`), cmd)
			}
		} else if (c.commandName === 'customAction') {
			const trackedLayer = await this.getTrackedLayer(c)
			if (!trackedLayer) {
				this.context.commandError(new Error(`No tracked layer found`), cmd)
				return
			}

			const response = await this.ografApi.renderTargetGraphicInvokeCustomAction(
				{
					rendererId: c.rendererId,
					customActionId: c.actionId,
				},
				{
					graphicInstanceId: trackedLayer.graphicInstanceId,
					renderTarget: this.formatRenderTarget(c.renderTarget),
					params: {
						id: c.actionId,
						payload: c.payload,
						skipAnimation: c.skipAnimation,
					},
				}
			)
			if (response.status !== 200) {
				this.context.commandError(new Error(`Error in reply: ${JSON.stringify(response.content)}`), cmd)
			}
		} else if (c.commandName === 'rendererCustomAction') {
			const response = await this.ografApi.rendererInvokeCustomAction(
				{
					rendererId: c.rendererId,
					customActionId: c.actionId,
				},
				{
					payload: c.payload,
					skipAnimation: c.skipAnimation,
				}
			)
			if (response.status !== 200) {
				this.context.commandError(new Error(`Error in reply: ${JSON.stringify(response.content)}`), cmd)
			}
		} else {
			assertNever(c)
		}
	}

	private formatRenderTarget(renderTarget: string): any {
		// RenderTarget is defined as a JSON string in the Mappings,
		// convert it to proper value:

		try {
			if (renderTarget.startsWith('{')) {
				return JSON.parse(renderTarget)
			} else if (renderTarget.startsWith('"')) {
				return JSON.parse(renderTarget)
			} else {
				return renderTarget
			}
		} catch (e) {
			this.context.logger.error(
				`Failed to parse renderTarget JSON: ${renderTarget}`,
				e instanceof Error ? e : new Error(`${e}`)
			)
			return `${renderTarget}`
		}
	}
	private async getTrackedLayer(o: {
		layerId: string
		rendererId: string
		renderTarget: unknown
		graphicId: string
	}): Promise<TrackedLayer | undefined> {
		const trackedLayer = this.trackedLayers[o.layerId]
		if (trackedLayer) return trackedLayer

		// Look up the current state on the server:
		const response = await this.ografApi.getRenderTarget(
			{
				rendererId: o.rendererId,
			},
			{
				renderTarget: o.renderTarget,
			}
		)
		if (response.status === 200) {
			if (response.content.graphicInstances) {
				for (const graphicInstance of response.content.graphicInstances) {
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

	private async getGraphicsInstanceId(params: {
		rendererId: string
		renderTarget: unknown
		graphicId?: string
		graphicInstanceId?: string
	}): Promise<string | undefined> {
		let graphicsInstanceId = params.graphicInstanceId
		if (!graphicsInstanceId) {
			// Just pick a graphic and use that:
			const renderTarget = await this.ografApi.getRenderTarget(
				{
					rendererId: params.rendererId,
				},
				{
					renderTarget: params.renderTarget,
				}
			)
			if (renderTarget.status === 200) {
				if (params.graphicId) {
					const graphicsInstance = renderTarget.content.graphicInstances.find(
						(gi) => gi.graphic.id === params.graphicId
					)
					if (graphicsInstance) graphicsInstanceId = graphicsInstance.graphicInstanceId
				} else {
					// Just pick one
					const firstGraphicsInstance = renderTarget.content.graphicInstances[0]
					if (firstGraphicsInstance) graphicsInstanceId = firstGraphicsInstance.graphicInstanceId
				}
			}
		}
		return graphicsInstanceId
	}
	private handleResponse(result: Record<string, any>) {
		if (result.status === 200) {
			return {
				result: ActionExecutionResultCode.Ok,
			}
		} else {
			const content = result.content as OGraf.ServerApi.components['schemas']['ErrorResponse']
			return {
				result: ActionExecutionResultCode.Error,
				response: stringifyErrorResponse(content),
			}
		}
	}
}
function stringifyErrorResponse(content: OGraf.ServerApi.components['schemas']['ErrorResponse']): ITranslatableMessage {
	return t('Error {{status}}: {{title}}, {{detail}}', {
		status: content.status,
		title: content.title,
		detail: content.detail,
	})
}
