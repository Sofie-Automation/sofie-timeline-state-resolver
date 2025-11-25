import {
	AnySourceRef,
	isRef,
	KairosConnection,
	MediaRamRecRef,
	MediaStatus,
	MediaStillRef,
	pathToRef,
	refToPath,
	ResponseError,
} from 'kairos-connection'
import { KairosDeviceState } from '../stateBuilder'
import { DeviceContextAPI } from 'timeline-state-resolver-api'

export class KairosRamLoader {
	private debounceTrackLoadRAM = new Set<string>()

	constructor(private kairos: KairosConnection, private context: DeviceContextAPI<KairosDeviceState>) {}

	async handleFailedRAMLoad(
		originalError: unknown,
		playerId: number,
		source: AnySourceRef | string,

		afterLoadSetModifiedStateCallback: (currentState: KairosDeviceState) => KairosDeviceState | false
	): Promise<void> {
		// This method is called whenever there was an "Error" in reply to using a ramrec/still.
		// This can happen if the ramrec/still is not loaded into RAM.
		// As a fallback, we try to load the ramrec into RAM, so that it can be played.

		// First, check if the thrown error is indeed a ResponseError
		if (!(originalError instanceof ResponseError)) throw originalError // Not a ResponseError, re-throw it

		const clipRef = typeof source === 'string' ? pathToRef(source) : source
		if (!isRef(clipRef) || (clipRef.realm !== 'media-still' && clipRef.realm !== 'media-ramrec')) throw originalError // Not a valid ramrec/still ref, re-throw the original error

		const identifier = clipRef.realm === 'media-ramrec' ? `RamRec ${refToPath(clipRef)}` : `Still ${refToPath(clipRef)}`

		// Step 1: Check that the clip exists:
		const media =
			clipRef.realm === 'media-ramrec'
				? await this.kairos.getMediaRamRec(clipRef)
				: await this.kairos.getMediaStill(clipRef)
		if (!media) throw new Error(`Cannot load ${identifier}: clip not found`)

		if (media.status === MediaStatus.ERROR) throw new Error(`Cannot load ${identifier}: status is ERROR`)

		// if (media.status === MediaStatus.LOAD && media.loadProgress === 1)
		// 	throw new Error(
		// 		`Error when load ${identifier}, it is already loaded. Original Error: ${originalError.message} ${
		// 			originalError.stack
		// 		}`
		// 	)

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
							status: MediaStatus.LOAD, // Load the ramrec into RAM
						})
					}
				}

				// Ensure that we're not already waiting for this clip to load:
				const debounceKey = `${identifier}_${playerId}`
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

				await this.context.setModifiedState(afterLoadSetModifiedStateCallback)
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
