import {
	BaseDeviceAPI,
	CommandWithContext,
	DeviceContextAPI,
	Device as DeviceInterface,
} from 'timeline-state-resolver-api'
import { DeviceStatus, Mapping, Timeline, TSRTimelineContent } from 'timeline-state-resolver-types'

export {
	CommandWithContext,
	BaseDeviceAPI,
	DeviceContextAPI,
	DeviceEvents,
} from 'timeline-state-resolver-api/src/device'

/**
 * API for use by the DeviceInstance to be able to use a device
 * @deprecated use the interface directly
 * */
export abstract class Device<
	DeviceTypes extends { Options: any; Mappings: any; Actions: Record<string, any> | null },
	DeviceState,
	Command extends CommandWithContext<any, any>,
	AddressState = void
> implements
		BaseDeviceAPI<DeviceState, AddressState, Command>,
		DeviceInterface<DeviceTypes, DeviceState, Command, AddressState>
{
	abstract actions: DeviceTypes['Actions']

	constructor(protected context: DeviceContextAPI<DeviceState, AddressState>) {
		// Nothing
	}

	/**
	 * Initiates the device connection, after this has resolved the device
	 * is ready to be controlled
	 */
	abstract init(options: DeviceTypes['Options']): Promise<boolean>
	/**
	 * Ready this class for garbage collection
	 */
	abstract terminate(): Promise<void>

	/** @deprecated */
	async makeReady(_okToDestroyStuff?: boolean): Promise<void> {
		// Do nothing by default
	}
	/** @deprecated */
	async standDown(): Promise<void> {
		// Do nothing by default
	}

	abstract get connected(): boolean
	abstract getStatus(): Omit<DeviceStatus, 'active'>

	// todo - add media objects

	// From BaseDeviceAPI: -----------------------------------------------
	abstract convertTimelineStateToDeviceState(
		state: Timeline.TimelineState<TSRTimelineContent>,
		newMappings: Record<string, Mapping<DeviceTypes['Mappings']>>
	): DeviceState | { deviceState: DeviceState; addressStates: Record<string, AddressState> }
	abstract diffStates(
		oldState: DeviceState | undefined,
		newState: DeviceState,
		mappings: Record<string, Mapping<DeviceTypes['Mappings']>>,
		time: number
	): Array<Command>
	abstract sendCommand(command: Command): Promise<void>

	applyAddressState?(state: DeviceState, address: string, addressState: AddressState): void
	diffAddressStates?(state1: AddressState, state2: AddressState): boolean
	addressStateReassertsControl?(oldState: AddressState | undefined, newState: AddressState): boolean
	// -------------------------------------------------------------------
}
