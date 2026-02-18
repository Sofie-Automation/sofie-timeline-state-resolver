import { DeviceType } from '../generated/index.js'

export type TimelineContentOgrafAny =
	| TimelineContentOGrafGraphic
	| TimelineContentOGrafGraphicStep
	| TimelineContentOGrafRendererCustomAction
export interface TimelineContentOGrafBase {
	deviceType: DeviceType.OGRAF
	type: TimelineContentTypeOgraf
}

export enum TimelineContentTypeOgraf {
	GRAPHIC = 'graphic',
	GRAPHIC_STEP = 'graphic_step',
	RENDERER_CUSTOM_ACTION = 'renderer_custom_action',
}
// export interface HTTPSendCommandContentExt extends Omit<HTTPSendCommandContent, 'url'> {
// 	url: string | TemplateString
// }

export type TimelineContentOGrafGraphic = TimelineContentOGrafBase & {
	type: TimelineContentTypeOgraf.GRAPHIC
	/** The Graphic to be loaded */
	graphicId: string

	/** If the graphic is playing (or just being pre-loaded) */
	playing?: boolean

	/** Any data to send into the graphic */
	data?: unknown

	/** If true, skips animation (defaults to false) */
	skipAnimation?: boolean

	/** Whether to use stop or CLEAR when stopping the graphic. Defaults to false = CLEAR  */
	useStopCommand?: boolean

	/** If set, goto step */
	goToStep?: number

	/** If set, any CustomActions to call on the Graphic */
	customActions?: {
		[key: string]: TimelineContentOGrafGraphicCustomAction
	}
}
export type TimelineContentOGrafGraphicCustomAction = {
	/** Action id, as defined by the Graphic manifest */
	id: string
	/** Payload to send into the Custom Action */
	payload: unknown

	/** Whenever this changes, the CustomAction will be triggered */
	triggerValue?: string | number
}
export type TimelineContentOGrafGraphicStep = TimelineContentOGrafBase & {
	type: TimelineContentTypeOgraf.GRAPHIC_STEP
	/** The Graphic to be controlled */
	graphicId: string

	/** The step delta to send to an ograf (playaction({delta})) */
	delta: number

	/** Whenever this changes, the a playAction({delta}) */
	triggerValue?: string | number

	/** If true, skips animation (defaults to false) */
	skipAnimation?: boolean
}

export type TimelineContentOGrafRendererCustomAction = TimelineContentOGrafBase & {
	type: TimelineContentTypeOgraf.RENDERER_CUSTOM_ACTION

	/** If set, any CustomActions to call on the Graphic */
	customActions?: {
		[key: string]: TimelineContentOGrafRendererCustomActionCustomAction
	}
}
export type TimelineContentOGrafRendererCustomActionCustomAction = {
	/** Action id, as defined by the Graphic manifest */
	id: string
	/** Payload to send into the Custom Action */
	payload: unknown

	/** If true, skips animation (defaults to false) */
	skipAnimation?: boolean

	/** Whenever this changes, the CustomAction will be triggered */
	triggerValue?: string | number
}
