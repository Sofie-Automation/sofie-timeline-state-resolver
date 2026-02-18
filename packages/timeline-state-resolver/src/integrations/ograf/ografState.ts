import {
	DeviceType,
	Mapping,
	MappingOgrafType,
	TimelineContentTypeOgraf,
	TimelineContentOGrafGraphic,
	TimelineContentOGrafRendererCustomAction,
	TSRTimelineContent,
	TimelineContentOGrafGraphicStep,
	TimelineContentOGrafRendererCustomActionCustomAction,
	TimelineContentOGrafGraphicCustomAction,
	Mappings,
	SomeMappingOgraf,
} from 'timeline-state-resolver-types'
import { assertNever } from '../../lib.js'
import { OGrafDeviceCommand } from './types.js'
import * as _ from 'underscore'
import { DeviceTimelineState } from 'timeline-state-resolver-api'

export interface OGrafDeviceStateGraphic {
	timelineObjId: string
	rendererId: string
	renderTarget: string
	content: TimelineContentOGrafGraphic
	//
	/** Tracked GraphicsInstance */
	graphicInstanceId?: string
}
export interface OGrafDeviceStateStepDelta {
	timelineObjId: string
	rendererId: string
	renderTarget: string
	content: TimelineContentOGrafGraphicStep
}
export interface OGrafDeviceStateCustomAction {
	timelineObjId: string
	rendererId: string
	action: TimelineContentOGrafRendererCustomAction
}
export interface OGrafDeviceState {
	/**
	 * Tracks any playing graphics.
	 * Tracks on a per-layer basis, since it is allowed to have more than one graphic per RenderTarget.
	 */
	graphics: {
		[layerId: string]: OGrafDeviceStateGraphic
	}
	/** Tracks state for Step Delta */
	graphicsStepDelta: {
		[layerId: string]: OGrafDeviceStateStepDelta
	}
	/** Tracks state for RendererCustomAction */
	rendererCustomActions: {
		[layerId: string]: OGrafDeviceStateCustomAction
	}
}

export function convertTimelineStateToDeviceState(
	state: DeviceTimelineState<TSRTimelineContent>,
	mappings: Mappings
): OGrafDeviceState {
	const deviceState: OGrafDeviceState = {
		graphics: {},
		graphicsStepDelta: {},
		rendererCustomActions: {},
	}

	for (const tlObject of state.objects) {
		const layerId = tlObject.layer
		const mapping = mappings[layerId] as Mapping<SomeMappingOgraf> | undefined
		if (!mapping) continue

		if (tlObject.content.deviceType !== DeviceType.OGRAF) continue
		if (tlObject.content.type === TimelineContentTypeOgraf.GRAPHIC) {
			if (mapping.options.mappingType !== MappingOgrafType.RenderTarget) continue

			deviceState.graphics[layerId] = {
				timelineObjId: tlObject.id,
				rendererId: mapping.options.rendererId,
				renderTarget: mapping.options.renderTarget,
				content: tlObject.content,
			}
		} else if (tlObject.content.type === TimelineContentTypeOgraf.GRAPHIC_STEP) {
			if (mapping.options.mappingType !== MappingOgrafType.RenderTarget) continue

			deviceState.graphicsStepDelta[layerId] = {
				timelineObjId: tlObject.id,
				rendererId: mapping.options.rendererId,
				renderTarget: mapping.options.renderTarget,
				content: tlObject.content,
			}
		} else if (tlObject.content.type === TimelineContentTypeOgraf.RENDERER_CUSTOM_ACTION) {
			if (mapping.options.mappingType !== MappingOgrafType.Renderer) continue

			deviceState.rendererCustomActions[layerId] = {
				timelineObjId: tlObject.id,
				rendererId: mapping.options.rendererId,
				action: tlObject.content,
			}
		} else {
			assertNever(tlObject.content)
		}
	}

	return deviceState
}

export function diffStates(oldState: OGrafDeviceState | undefined, newState: OGrafDeviceState): OGrafDeviceCommand[] {
	const commands: OGrafDeviceCommand[] = []

	// Go through any new or changed graphics:
	for (const [layerId, newGraphic] of Object.entries<OGrafDeviceStateGraphic>(newState.graphics)) {
		const oldGraphic = oldState && oldState.graphics[layerId]

		let hasLoadedNewGraphic = false

		if (
			!oldGraphic ||
			oldGraphic.rendererId !== newGraphic.rendererId ||
			oldGraphic.renderTarget !== newGraphic.renderTarget ||
			oldGraphic.content.graphicId !== newGraphic.content.graphicId
		) {
			let loadGraphicReason = 'N/A'
			if (!oldGraphic) loadGraphicReason = 'New graphic'
			else if (oldGraphic.rendererId !== newGraphic.rendererId)
				loadGraphicReason = `rendererId changed from ${oldGraphic.rendererId} to ${newGraphic.rendererId}`
			else if (oldGraphic.renderTarget !== newGraphic.renderTarget)
				loadGraphicReason = `renderTarget changed from ${oldGraphic.renderTarget} to ${newGraphic.renderTarget}`
			else if (oldGraphic.content.graphicId !== newGraphic.content.graphicId)
				loadGraphicReason = `graphicId changed from ${oldGraphic.content.graphicId} to ${newGraphic.content.graphicId}`

			if (oldGraphic) {
				// Unload old graphic, to be replaced

				if (oldGraphic.content.useStopCommand) {
					commands.unshift({
						context: 'Stop to replace graphic',
						queueId: layerId,
						timelineObjId: oldGraphic.timelineObjId,
						command: {
							layerId,
							commandName: 'stop',
							rendererId: oldGraphic.rendererId,
							renderTarget: oldGraphic.renderTarget,
							graphicId: oldGraphic.content.graphicId,
						},
					})
				} else {
					commands.unshift({
						context: 'Clear to replace graphic',
						queueId: layerId,
						timelineObjId: oldGraphic.timelineObjId,
						command: {
							layerId,
							commandName: 'clear',
							rendererId: oldGraphic.rendererId,
							renderTarget: oldGraphic.renderTarget,
							graphicId: oldGraphic.content.graphicId,
						},
					})
				}
			}

			// Load new graphic

			hasLoadedNewGraphic = true
			commands.push({
				context: `Load graphic: ${loadGraphicReason}`,
				queueId: layerId,
				timelineObjId: newGraphic.timelineObjId,
				command: {
					layerId,
					commandName: 'load',
					rendererId: newGraphic.rendererId,
					renderTarget: newGraphic.renderTarget,
					graphicId: newGraphic.content.graphicId,
					data: newGraphic.content.data,
				},
			})

			if (newGraphic.content.playing) {
				// Play

				commands.push({
					context: 'Initial Play',
					queueId: layerId,
					timelineObjId: newGraphic.timelineObjId,
					command: {
						layerId,
						commandName: 'play',
						rendererId: newGraphic.rendererId,
						renderTarget: newGraphic.renderTarget,
						graphicId: newGraphic.content.graphicId,

						skipAnimation: newGraphic.content.skipAnimation,
						goto: newGraphic.content.goToStep,
					},
				})
			}
		} else {
			// Update existing graphic

			if (!_.isEqual(newGraphic.content.data, oldGraphic.content.data)) {
				const reason = `data changed`
				// Update data
				commands.push({
					context: `Update: ${reason}`,
					queueId: layerId,
					timelineObjId: newGraphic.timelineObjId,
					command: {
						layerId,
						commandName: 'update',
						rendererId: newGraphic.rendererId,
						renderTarget: newGraphic.renderTarget,
						graphicId: newGraphic.content.graphicId,

						data: newGraphic.content.data,
						skipAnimation: newGraphic.content.skipAnimation,
					},
				})
			}

			if (
				newGraphic.content.playing &&
				// Start playing:
				(!oldGraphic.content.playing ||
					// Goto step:
					(newGraphic.content.goToStep !== undefined && newGraphic.content.goToStep !== oldGraphic.content.goToStep))
			) {
				let reason = 'N/A'
				if (!oldGraphic.content.playing) reason = 'Start playing'
				if (newGraphic.content.goToStep !== undefined && newGraphic.content.goToStep !== oldGraphic.content.goToStep)
					reason = `goToStep changed from ${oldGraphic.content.goToStep} to ${newGraphic.content.goToStep}`

				// Play:
				commands.push({
					context: `Play: ${reason}`,
					queueId: layerId,
					timelineObjId: newGraphic.timelineObjId,
					command: {
						layerId,
						commandName: 'play',
						rendererId: newGraphic.rendererId,
						renderTarget: newGraphic.renderTarget,
						graphicId: newGraphic.content.graphicId,

						skipAnimation: newGraphic.content.skipAnimation,
						goto: newGraphic.content.goToStep,
					},
				})
			} else if (!newGraphic.content.playing && oldGraphic.content.playing) {
				const reason = `playing changed from ${oldGraphic.content.playing} to ${newGraphic.content.playing}`
				// Stop
				commands.push({
					context: `Stop: ${reason}`,
					queueId: layerId,
					timelineObjId: newGraphic.timelineObjId,
					command: {
						layerId,
						commandName: 'stop',
						rendererId: newGraphic.rendererId,
						renderTarget: newGraphic.renderTarget,
						graphicId: newGraphic.content.graphicId,

						skipAnimation: newGraphic.content.skipAnimation,
					},
				})
			}
		}

		// Custom Actions:
		for (const [key, newAction] of Object.entries<TimelineContentOGrafGraphicCustomAction>(
			newGraphic.content.customActions ?? {}
		)) {
			const oldAction = oldGraphic?.content?.customActions?.[key]
			if (
				hasLoadedNewGraphic ||
				!oldAction ||
				oldAction.triggerValue !== newAction.triggerValue ||
				oldAction.id !== newAction.id ||
				!_.isEqual(oldAction.payload, newAction.payload)
			) {
				let reason: string | undefined = undefined
				if (hasLoadedNewGraphic) reason = 'New Graphic loaded'
				else if (!oldAction) reason = 'New action'
				else if (oldAction.triggerValue !== newAction.triggerValue)
					reason = `triggerValue changed from ${oldAction.triggerValue} to ${newAction.triggerValue}`
				else if (oldAction.id !== newAction.id) reason = `id changed from ${oldAction.id} to ${newAction.id}`
				else if (!_.isEqual(oldAction.payload, newAction.payload)) reason = `payload changed`

				// Trigger CustomAction
				commands.push({
					context: `CustomAction: ${reason}`,
					queueId: layerId,
					timelineObjId: newGraphic.timelineObjId,
					command: {
						layerId,
						commandName: 'customAction',
						rendererId: newGraphic.rendererId,
						renderTarget: newGraphic.renderTarget,
						graphicId: newGraphic.content.graphicId,

						actionId: newAction.id,
						payload: newAction.payload,
						skipAnimation: newGraphic.content.skipAnimation,
					},
				})
			}
		}
	}
	// Go through any removed graphics:
	if (oldState) {
		for (const [layerId, oldGraphic] of Object.entries<OGrafDeviceStateGraphic>(oldState.graphics)) {
			if (!newState.graphics[layerId]) {
				// Unload old graphic

				if (oldGraphic.content.useStopCommand) {
					commands.unshift({
						context: 'Stop graphic',
						queueId: layerId,
						timelineObjId: oldGraphic.timelineObjId,
						command: {
							layerId,
							commandName: 'stop',
							rendererId: oldGraphic.rendererId,
							renderTarget: oldGraphic.renderTarget,
							graphicId: oldGraphic.content.graphicId,
						},
					})
				} else {
					commands.unshift({
						context: 'Remove graphic',
						queueId: layerId,
						timelineObjId: oldGraphic.timelineObjId,
						command: {
							layerId,
							commandName: 'clear',
							rendererId: oldGraphic.rendererId,
							renderTarget: oldGraphic.renderTarget,
							graphicId: oldGraphic.content.graphicId,
						},
					})
				}
			}
		}
	}

	for (const [layerId, newGraphicsStepDelta] of Object.entries<OGrafDeviceStateStepDelta>(newState.graphicsStepDelta)) {
		const oldGraphicsStepDelta = oldState?.graphicsStepDelta?.[layerId]

		if (
			!oldGraphicsStepDelta ||
			oldGraphicsStepDelta.content.delta !== oldGraphicsStepDelta.content.delta ||
			oldGraphicsStepDelta.content.triggerValue !== oldGraphicsStepDelta.content.triggerValue
		) {
			let reason = 'N/A'
			if (!oldGraphicsStepDelta) reason = 'New action'
			else if (oldGraphicsStepDelta.content.delta !== newGraphicsStepDelta.content.delta)
				reason = `delta changed from ${oldGraphicsStepDelta.content.delta} to ${newGraphicsStepDelta.content.delta}`
			else if (oldGraphicsStepDelta.content.triggerValue !== newGraphicsStepDelta.content.triggerValue)
				reason = `triggerValue changed from ${oldGraphicsStepDelta.content.triggerValue} to ${newGraphicsStepDelta.content.triggerValue}`

			// Trigger RendererCustomAction
			commands.push({
				context: `Play Delta: ${reason}`,
				queueId: layerId,
				timelineObjId: newGraphicsStepDelta.timelineObjId,
				command: {
					layerId,
					commandName: 'play',
					rendererId: newGraphicsStepDelta.rendererId,
					renderTarget: newGraphicsStepDelta.renderTarget,
					graphicId: newGraphicsStepDelta.content.graphicId,
					delta: newGraphicsStepDelta.content.delta,
					skipAnimation: newGraphicsStepDelta.content.skipAnimation,
				},
			})
		}
	}
	for (const [layerId, newRendererCustomAction] of Object.entries<OGrafDeviceStateCustomAction>(
		newState.rendererCustomActions
	)) {
		const oldRendererCustomAction = oldState?.rendererCustomActions?.[layerId]

		for (const [key, newAction] of Object.entries<TimelineContentOGrafRendererCustomActionCustomAction>(
			newRendererCustomAction.action.customActions ?? {}
		)) {
			const oldAction = oldRendererCustomAction?.action.customActions?.[key]

			if (
				!oldAction ||
				oldAction.id !== newAction.id ||
				oldAction.triggerValue !== newAction.triggerValue ||
				!_.isEqual(oldAction.payload, newAction.payload)
			) {
				let reason = 'N/A'
				if (!oldAction) reason = 'New action'
				else if (oldAction.id !== newAction.id) reason = `id changed from ${oldAction.id} to ${newAction.id}`
				else if (oldAction.triggerValue !== newAction.triggerValue)
					reason = `triggerValue changed from ${oldAction.triggerValue} to ${newAction.triggerValue}`
				else if (!_.isEqual(oldAction.payload, newAction.payload)) reason = `payload changed`

				// Trigger RendererCustomAction
				commands.push({
					context: `RendererCustomAction: ${reason}`,
					queueId: layerId,
					timelineObjId: newRendererCustomAction.timelineObjId,
					command: {
						layerId,
						commandName: 'rendererCustomAction',
						rendererId: newRendererCustomAction.rendererId,
						actionId: newAction.id,
						payload: newAction.payload,
						skipAnimation: newAction.skipAnimation,
					},
				})
			}
		}
	}
	return commands
}
