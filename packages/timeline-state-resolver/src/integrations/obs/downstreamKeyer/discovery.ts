import type { OBSResponseTypes } from 'obs-websocket-js'
import type { OBSDownstreamKeyerCache } from './types'
import { DSK_VENDOR_NAME } from './types'

function toStringArray(value: unknown): string[] | undefined {
	if (!Array.isArray(value)) return undefined
	const out: string[] = []
	for (const v of value) {
		if (typeof v === 'string') out.push(v)
	}
	return out.length ? out : undefined
}

function extractScenesFromResponseData(responseData: unknown): string[] {
	if (!responseData || typeof responseData !== 'object') return []
	const data = responseData as any

	// Common shapes:
	// - { scenes: ["A","B"] }
	// - { downstream_keyers: [ { scenes: [...] }, ... ] }
	// - { downstreamKeyers: [ { scenes: [...] }, ... ] }
	// - { downstream_keyer: { scenes: [...] } }
	// - { downstreamKeyer: { scenes: [...] } }

	const direct = toStringArray(data.scenes)
	if (direct) return direct

	const keyers = data.downstream_keyers ?? data.downstreamKeyers
	if (Array.isArray(keyers)) {
		const scenes: string[] = []
		for (const k of keyers) {
			const s = toStringArray(k?.scenes)
			if (s) scenes.push(...s)
		}
		return scenes
	}

	const single = data.downstream_keyer ?? data.downstreamKeyer
	const singleScenes = toStringArray(single?.scenes)
	if (singleScenes) return singleScenes

	return []
}

export async function refreshDownstreamKeyerCache(
	call: <Type extends 'CallVendorRequest'>(
		requestType: Type,
		requestData: OBSRequestTypesForCallVendorRequest
	) => Promise<OBSResponseTypes[Type]>
): Promise<OBSDownstreamKeyerCache | undefined> {
	// Try the most general first:
	const tryRequest = async (requestType: string): Promise<unknown> => {
		const res = await call('CallVendorRequest', {
			vendorName: DSK_VENDOR_NAME,
			requestType,
			requestData: {},
		} as any)
		return (res as any)?.responseData
	}

	try {
		const data = await tryRequest('get_downstream_keyers')
		const scenes = extractScenesFromResponseData(data)
		return { scenes: new Set(scenes) }
	} catch (e0) {
		try {
			const data = await tryRequest('get_downstream_keyer')
			const scenes = extractScenesFromResponseData(data)
			return { scenes: new Set(scenes) }
		} catch (e1) {
			return undefined
		}
	}
}

// Local helper type: keep this file independent of obs-websocket-js internals
type OBSRequestTypesForCallVendorRequest = {
	vendorName: string
	requestType: string
	requestData?: unknown
}

