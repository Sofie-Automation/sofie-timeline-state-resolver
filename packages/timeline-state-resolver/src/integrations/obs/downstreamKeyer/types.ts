export interface OBSDownstreamKeyerState {
	selectedScene?: string
	ensureInDskList?: boolean
}

export interface OBSDownstreamKeyerCache {
	/** Scenes known to exist in the plugin's list */
	scenes: ReadonlySet<string>
}

export const DSK_VENDOR_NAME = 'downstream-keyer' as const

export type DskVendorRequestType =
	| 'get_downstream_keyers'
	| 'get_downstream_keyer'
	| 'dsk_select_scene'
	| 'dsk_add_scene'

export interface DskSelectSceneRequest {
	scene: string
}
export interface DskAddSceneRequest {
	scene: string
}

