import type { SlowSentCommandInfo, SlowFulfilledCommandInfo, CommandReport } from './commandReport'
import type { FinishedTrace } from './trace'
import type {
	Timeline,
	TSRTimelineContent,
	Mappings,
	DeviceStatus,
	MediaObject,
	Mapping,
	TSRTimelineObjProps,
} from 'timeline-state-resolver-types'

/**
 * The intended usage of this is for each device to define an alias with the generic types provided.
 * Like so:
 * export interface MyDeviceCommand {
 *   // device specific properties here
 * }
 * export type MyDeviceCommandWithContext = CommandWithContext<MyDeviceCommand, string>
 */
export type CommandWithContext<TCommand, TContext> = {
	/** Device specific command (to be defined by the device itself) */
	command: TCommand
	/**
	 * The context is provided for logging / troubleshooting reasons.
	 * It should contain some kind of explanation as to WHY a command was created (like a reference, path etc.)
	 */
	context: TContext
	/** ID of the timeline-object that the command originated from */
	timelineObjId: string
	/** this command is to be executed x ms _before_ the scheduled time */
	preliminary?: number
	/** commands with different queueId's can be executed in parallel in sequential mode */
	queueId?: string
}

export interface DeviceTimelineState<TContent extends TSRTimelineContent = TSRTimelineContent> {
	/** The timestamp for this state */
	time: Timeline.Time
	/** All objects that are active on each respective layer */
	objects: DeviceTimelineStateObject<TContent>[]
}

/**
 * A simplified representation of the TimelineObjet that was matched for this device
 */
export interface DeviceTimelineStateObject<TContent extends TSRTimelineContent = TSRTimelineContent>
	extends TSRTimelineObjProps {
	/** ID of the object. Must be unique! */
	id: string
	/**
	 * Priority. Affects which object "wins" when there are two colliding objects on the same layer.
	 */
	priority: number
	/**
	 * The layer where the object is played.
	 * */
	layer: string | number
	/** The payload of the timeline-object. Can be anything you want. */
	content: TContent

	instance: Timeline.TimelineObjectInstance

	/** All datastore values applied and the timestamp of when they were applied */
	datastoreRefs?: Record<string, number>
	/** Timestamp of the last datastore value applied to this object */
	lastModified?: number
}

/**
 * API for use by the DeviceInstance to be able to use a device
 */
export interface Device<
	DeviceTypes extends { Options: any; Mappings: any; Actions: Record<string, any> | null },
	DeviceState,
	Command extends CommandWithContext<any, any>,
	AddressState = void
> extends BaseDeviceAPI<DeviceState, AddressState, Command> {
	readonly actions: DeviceTypes['Actions']

	/**
	 * Initiates the device connection, after this has resolved the device
	 * is ready to be controlled
	 */
	init(options: DeviceTypes['Options']): Promise<boolean>
	/**
	 * Ready this class for garbage collection
	 */
	terminate(): Promise<void>

	get connected(): boolean
	getStatus(): Omit<DeviceStatus, 'active'>

	// todo - add media objects

	// From BaseDeviceAPI: -----------------------------------------------
	convertTimelineStateToDeviceState(
		state: DeviceTimelineState,
		newMappings: Record<string, Mapping<DeviceTypes['Mappings']>>
	): DeviceState | { deviceState: DeviceState; addressStates: Record<string, AddressState> }
	diffStates(
		oldState: DeviceState | undefined,
		newState: DeviceState,
		mappings: Record<string, Mapping<DeviceTypes['Mappings']>>,
		time: number
	): Array<Command>
	sendCommand(command: Command): Promise<void>

	applyAddressState?(state: DeviceState, address: string, addressState: AddressState): void
	diffAddressStates?(state1: AddressState, state2: AddressState): boolean
	addressStateReassertsControl?(oldState: AddressState | undefined, newState: AddressState): boolean
	// -------------------------------------------------------------------
}

/**
 * Minimal API for the StateHandler to be able to use a device
 */
export interface BaseDeviceAPI<DeviceState, AddressState, Command extends CommandWithContext<any, any>> {
	/**
	 * This method takes in a Timeline State that describes a point
	 * in time on the timeline and converts it into a "device state" that
	 * describes how the device should be according to the timeline state.
	 * Transforming the DeviceState to something else is optional, and are intended to simplify diffing logic.
	 * The order of TSR is:
	 * - Timeline Object in Timeline State ->
	 * - Device State (`convertTimelineStateToDeviceState()`) ->
	 * - Planned Device Commands (`difStates()`) ->
	 * - Send Command (`sendCommand()`)
	 * @param state State obj from timeline
	 * @param newMappings Mappings to resolve devices with
	 * @returns Device state (that is fed into `diffStates()` )
	 */
	convertTimelineStateToDeviceState(
		state: DeviceTimelineState,
		newMappings: Mappings
	): DeviceState | { deviceState: DeviceState; addressStates: Record<string, AddressState> }

	/**
	 * The implementation of this method should apply the state from an address to a device
	 * state in place
	 * @param state the state object from convertTimelineToDeviceState
	 * @param address The address of the state to be applied
	 * @param addressState The state to be applied
	 */
	applyAddressState?(state: DeviceState, address: string, addressState: AddressState): void
	/**
	 * The implementation should return true if the contents of the address state differ,
	 * but not if only the control value differs
	 */
	diffAddressStates?(state1: AddressState, state2: AddressState): boolean
	/**
	 * Returns true if the
	 */
	addressStateReassertsControl?(oldState: AddressState | undefined, newState: AddressState): boolean
	/**
	 * This method takes 2 states and returns a set of device-commands that will
	 * transition the device from oldState to newState.
	 *
	 * This is basically the place where we generate the planned commands for the device,
	 * to be executed later, by `sendCommand()`.
	 */
	diffStates(
		oldState: DeviceState | undefined,
		newState: DeviceState,
		mappings: Mappings,
		currentTime: number
	): Array<Command>
	/** This method will take a command and send it to the device */
	sendCommand(command: Command): Promise<void>
}

/** Events emitted by the device, to be listened on by Conductor */
export interface DeviceEvents {
	info: [info: string]
	warning: [warning: string]
	error: [context: string, err: Error]
	debug: [...debug: any[]]
	debugState: [state: object]
	/** The connection status has changed */
	connectionChanged: [status: Omit<DeviceStatus, 'active'>]
	/** A message to the resolver that something has happened that warrants a reset of the resolver (to re-run it again) */
	resetResolver: []
	/** A message to the resolver that the device needs to receive all known states */
	resyncStates: []

	/** @deprecated replaced by slowSentCommand & slowFulfilledCommand  */
	slowCommand: [commandInfo: string]
	/** A report that a command was sent too late */
	slowSentCommand: [info: SlowSentCommandInfo]
	/** A report that a command was fullfilled too late */
	slowFulfilledCommand: [info: SlowFulfilledCommandInfo]
	commandReport: [commandReport: CommandReport]

	/** Something went wrong when executing a command  */
	commandError: [error: Error, context: CommandWithContext<any, any>]
	/** Update a MediaObject  */
	updateMediaObject: [collectionId: string, docId: string, doc: MediaObject | null]
	/** Clear a MediaObjects collection */
	clearMediaObjects: [collectionId: string]

	timeTrace: [trace: FinishedTrace]
}

/** Various methods that the Devices can call */
export interface DeviceContextAPI<DeviceState, AddressState = void> {
	logger: {
		/** Emit a "error" message */
		error: (context: string, err: Error) => void
		/** Emit a "warning" message */
		warning: (warning: string) => void
		/** Emit a "info" message */
		info: (info: string) => void
		/** Emit a "debug" message */
		debug: (...debug: any[]) => void
	}

	/** Emit a "debugState" message */
	emitDebugState: (state: object) => void

	getCurrentTime: () => number

	/** Notify that the connection status has changed. */
	connectionChanged: (status: Omit<DeviceStatus, 'active'>) => void
	/**
	 * Notify the conductor that it should reset the resolver, in order to trigger it again.
	 * Note: this will not change anything about the current state and should technically not lead
	 * to any new commands being sent
	 */
	resetResolver: () => void

	/** Something went wrong when executing a command  */
	commandError: (error: Error, context: CommandWithContext<any, any>) => void
	/** Update a MediaObject  */
	updateMediaObject: (collectionId: string, docId: string, doc: MediaObject | null) => void
	/** Clear a MediaObjects collection */
	clearMediaObjects: (collectionId: string) => void

	timeTrace: (trace: FinishedTrace) => void

	/** Reset the tracked device state to undefined and notify the conductor to reset the resolver */
	resetState: () => Promise<void>

	/** Reset the tracked device state to "state" and notify the conductor to reset the resolver */
	resetToState: (state: DeviceState) => Promise<void>

	/** Calculate a new diff for the next state change */
	recalcDiff: () => void

	setAddressState: (address: string, state: AddressState) => void
}
