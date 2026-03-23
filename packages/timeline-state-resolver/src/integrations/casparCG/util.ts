import { Enum } from 'casparcg-connection'
import { CasparCGScaleMode } from 'timeline-state-resolver-types'

export function convertScaleModeToConnection(
	scaleMode: CasparCGScaleMode | undefined
): Enum.ProducerScaleMode | undefined {
	// There is a unit test to ensure that these align
	return scaleMode as unknown as Enum.ProducerScaleMode | undefined
}
