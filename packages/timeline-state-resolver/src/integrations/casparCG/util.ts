import { ProducerScaleMode } from 'casparcg-connection/dist/enums'
import { CasparCGScaleMode } from 'timeline-state-resolver-types'

export function convertScaleModeToConnection(scaleMode: CasparCGScaleMode | undefined): ProducerScaleMode | undefined {
	// There is a unit test to ensure that these align
	return scaleMode as unknown as ProducerScaleMode | undefined
}
