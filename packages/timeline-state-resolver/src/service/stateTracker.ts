import { EventEmitter } from 'node:events'

const SETTLE_TIME = 200 // ms

export interface StateTrackerEvents {
	/** Emitted when an address is ahead of the timeline state when it was under control */
	deviceAhead: [address: string]
	/** Emitted when control over an address has been reasserted, i.e. it was previously ahead of the timeline state and is now in sync */
	deviceUnderControl: [address: string]
	/** Emitted every time an address state changes while it is ahead of the timeline */
	deviceUpdated: [address: string, deviceAhead: boolean]
}

/**
 * A StateTracker tracks addressable substates of a whole device's state.
 * For every Address it tracks both the expected state - i.e. the state that
 * TSR thinks the device should be in as well as the actual state - i.e. what
 * the device has reported back to us
 *
 * An Address can be any string, typically you want it to be a form of a hash
 * for what part of the device's state it is for, for an Atem it may look something
 * like video.mixEffect.0.upstreamKeyer.1 to indicate the second keyer on the
 * first ME.
 *
 * An Address is "ahead" when the device reports the state for that Address
 * is different than the expected state. To ensure we are not seeing a one-off
 * issue we make sure to wait 200ms to see if any other state updates come through
 * before marking something as "ahead".
 *
 * Internally, each address state should carry some information that tells it when
 * control over the device is to be reasserted. This is considered the "control value".
 * Examples are the id's of the timeline objects that affect the address state, or a
 * timestamp indicating when it last changed. When this "control value" changes,
 */
export class StateTracker<State> extends EventEmitter<StateTrackerEvents> {
	private _state: {
		[address: string]: InternalAddressState<State>
	} = {}
	private waitToSettle = new Map<string, NodeJS.Timeout>()

	/**
	 *
	 * @param diff Method that compares 2 Address States and returns true if they are different
	 * @param syncOnFirstBlood If set to true and a current state is reported for an Address without a current state, the address wil NOT be marked as ahead
	 */
	constructor(private diff: (state1: State, state2: State | undefined) => boolean, private syncOnFirstBlood: boolean) {
		super()
	}

	/**
	 * @param address Address to check
	 * @returns true if the Address State is different from the timeline
	 */
	isDeviceAhead(address: string): boolean {
		return this._state[address]?.deviceAhead ?? false
	}

	/**
	 * Update the expected state for a given Address
	 *
	 * @param address Address to update
	 * @param state New expected state
	 * @param didSetDevice true if this update sent commands to the device
	 */
	updateExpectedState(address: string, state: State, didSetDevice: boolean) {
		this._assertAddressExists(address)
		this._state[address].expectedState = state

		if (this._state[address].deviceAhead && didSetDevice) {
			// mark device as in sync
			this._state[address].deviceAhead = false
			this.emit('deviceUnderControl', address)
		}
	}

	/**
	 * Looks up the expected state for a given address
	 *
	 * @param address Address to return
	 * @returns Address State
	 */
	getExpectedState(address: string): State | undefined {
		return this._state[address]?.expectedState
	}

	/**
	 * Remove/unset the expected state for a given address indicating it is no longer described by the timeline
	 *
	 * @param address Address to update
	 */
	unsetExpectedState(address: string) {
		if (!this._state[address]) {
			// address not found => expectedState is already undefined
			return
		}
		this._state[address].expectedState = undefined
	}

	/**
	 * Update the current state for a given Address as read directly from the device
	 *
	 * @param address Address to update
	 * @param state New state
	 */
	updateState(address: string, state: State) {
		const firstBlood = !this._state[address]

		this._assertAddressExists(address)
		this._state[address].currentState = state

		if (firstBlood && !this.getExpectedState(address)) {
			if (!this.syncOnFirstBlood) {
				this._state[address].deviceAhead = true
				this.emit('deviceAhead', address)
			}

			return
		}

		if (this.waitToSettle.get(address)) clearTimeout(this.waitToSettle.get(address))
		this.waitToSettle.set(
			address,
			setTimeout(() => {
				if (this.waitToSettle.get(address)) clearTimeout(this.waitToSettle.get(address))

				const expectedState = this.getExpectedState(address)
				if (!this._state[address].deviceAhead && (!expectedState || this.diff(state, expectedState))) {
					this._state[address].deviceAhead = true
					this.emit('deviceAhead', address)
				}
				// note - if seeing a lot of these events it may be worth only emitting them when the incoming update differs from what was there
				this.emit('deviceUpdated', address, this._state[address].deviceAhead)
			}, SETTLE_TIME)
		)
	}
	/**
	 * Looks up the current state for a given address
	 *
	 * @param address Address to return
	 * @returns Address State
	 */
	getCurrentState(address: string): State | undefined {
		return this._state[address]?.currentState
	}

	/**
	 * @returns All addresses that are tracked
	 */
	getAllAddresses(): string[] {
		return Object.keys(this._state)
	}

	/**
	 * Removes all addresses
	 */
	clearState() {
		this._state = {}
	}

	private _assertAddressExists(address: string) {
		if (!this._state[address])
			this._state[address] = {
				expectedState: undefined,
				currentState: undefined,
				deviceAhead: false,
			}
	}
}

interface InternalAddressState<State> {
	/** State as intended by the timeline / TSR */
	expectedState: State | undefined
	/** State as reported by the device */
	currentState: State | undefined
	/** If true the device is ahead of the timeline state and the TSR should not assert its state */
	deviceAhead: boolean
}
