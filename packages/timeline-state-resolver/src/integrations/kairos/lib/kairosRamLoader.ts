import {
	AnySourceRef,
	isRef,
	KairosConnection,
	MediaRamRecRef,
	MediaStatus,
	MediaStillRef,
	pathToRef,
	refToPath,
} from 'kairos-connection'
import { KairosDeviceState } from '../stateBuilder.js'
import { DeviceContextAPI } from 'timeline-state-resolver-api'

export class KairosRamLoader {
	private debounceTrackLoadRAM = new Set<string>()

	constructor(
		private kairos: KairosConnection,
		private context: DeviceContextAPI<KairosDeviceState>
	) {}

	async ensureRAMLoaded(
		playerIdentifier: number | string,
		source: AnySourceRef | string,

		afterLoadSetModifiedStateCallback: (currentState: KairosDeviceState | undefined) => KairosDeviceState | false
	): Promise<void> {
		// This method is called to ensure that a ramrec/still is loaded into RAM.
		// If the ramrec/still is not loaded into RAM it cannot be used.

		const clipRef = typeof source === 'string' ? pathToRef(source) : source
		if (!isRef(clipRef) || (clipRef.realm !== 'media-still' && clipRef.realm !== 'media-ramrec')) {
			this.context.logger.error(
				'KairosRamLoader',
				new Error(`KairosRamLoader: Unsupported clip reference for RAM loading: ${JSON.stringify(source)}`)
			)
			return
		}

		const identifier = clipRef.realm === 'media-ramrec' ? `RamRec ${refToPath(clipRef)}` : `Still ${refToPath(clipRef)}`

		// Step 1: Check that the clip exists:
		const media =
			clipRef.realm === 'media-ramrec'
				? await this.kairos.getMediaRamRec(clipRef)
				: await this.kairos.getMediaStill(clipRef)
		if (!media) throw new Error(`Cannot load ${identifier}: clip not found`)

		if (media.status === MediaStatus.ERROR) throw new Error(`Cannot load ${identifier}: status is ERROR`)

		if (media.status === MediaStatus.LOAD && media.loadProgress === 1) {
			// Is already loaded, OK
			return
		}

		// Run the rest asynchronously, to not block commands (since we execute commands sequentially):
		Promise.resolve()
			.then(async () => {
				// Step 2: Load the clip into RAM
				if (media.status === MediaStatus.NOT_LOADED) {
					if (clipRef.realm === 'media-ramrec') {
						await this.kairos.updateMediaRamRec(clipRef, {
							status: MediaStatus.LOAD, // Load the ramrec into RAM
						})
					} else {
						await this.kairos.updateMediaStill(clipRef, {
							status: MediaStatus.LOAD, // Load the still into RAM
						})
					}
				}

				// Ensure that we're not already waiting for this clip to load:
				const debounceKey = `${identifier}_${playerIdentifier}`
				if (this.debounceTrackLoadRAM.has(debounceKey)) return // Already waiting for this clip to load
				this.debounceTrackLoadRAM.add(debounceKey)

				try {
					// Step 3: When the clip has been loaded, trigger a re-run of diffState so that it'll be loaded into the RAM player:
					// (Note: we must not manually load it after a delay, as the timeline state might have changed in the meantime.)
					await this.waitForLoadStatus(clipRef)
				} finally {
					this.debounceTrackLoadRAM.delete(debounceKey)
				}

				// Modify the current device state to reflect that the clip is not loaded yet.
				// Upon re-triggering diffState, it'll attempt to load the clip again.

				this.context.setModifiedState(afterLoadSetModifiedStateCallback)
				// ^ This will cause TSR to re-run the diffState and thus try to load the clip again.
			})
			.catch((e) => this.context.logger.error(`Error while waiting for ramrec load: ${e}`, e))
	}

	async waitForLoadStatus(clipRef: MediaRamRecRef | MediaStillRef, maxWait = 60000): Promise<void> {
		const startTime = Date.now()
		while (Date.now() - startTime < maxWait) {
			const clip =
				clipRef.realm === 'media-ramrec'
					? await this.kairos.getMediaRamRec(clipRef)
					: await this.kairos.getMediaStill(clipRef)

			if (clip?.status === MediaStatus.LOAD && clip.loadProgress === 1) {
				return
			} else {
				await this.sleep(2000)
			}
		}
		throw new Error(`Timeout waiting for media ${refToPath(clipRef)} to load`)
	}

	async sleep(duration = 100): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, duration))
	}
}
