import * as _ from 'underscore'
import {
	Mappings,
	SisyfosOptions,
	SomeMappingSisyfos,
	MappingSisyfosType,
	TimelineContentSisyfosAny,
	TimelineContentTypeSisyfos,
	SisyfosChannelOptions,
	MappingSisyfosChannel,
	TSRTimelineContent,
	Mapping,
	ActionExecutionResultCode,
	SetSisyfosChannelStatePayload,
	LoadMixerPresetPayload,
	ActionExecutionResult,
	SisyfosDeviceTypes,
	DeviceStatus,
	StatusCode,
} from 'timeline-state-resolver-types'

import { SisyfosApi, SisyfosCommand, SisyfosState, SisyfosChannel, SisyfosCommandType } from './connection.js'
import Debug from 'debug'
import { t } from '../../lib.js'
import { CommandWithContext, Device, DeviceContextAPI, DeviceTimelineState } from 'timeline-state-resolver-api'

const debug = Debug('timeline-state-resolver:sisyfos')

type Command = CommandWithContext<SisyfosCommand, string>

export class SisyfosMessageDevice implements Device<SisyfosDeviceTypes, SisyfosState, Command> {
	private _sisyfos: SisyfosApi
	private _isResyncPending = false
	private logger: DeviceContextAPI<SisyfosState>['logger']

	constructor(protected context: DeviceContextAPI<SisyfosState>) {
		this.logger = this.context.logger // just for convenience

		this._sisyfos = new SisyfosApi()
		this._sisyfos.on('error', (e) => this.logger.error('error', e))
		this._sisyfos.on('connected', () => {
			this._connectionChanged()
		})
		this._sisyfos.on('disconnected', () => {
			this._connectionChanged()
		})
		this._sisyfos.on('initialized', () => {
			this._connectionChanged()
		})
		this._sisyfos.on('mixerOnlineChanged', () => {
			this._connectionChanged()
		})
	}

	public async reinit(): Promise<ActionExecutionResult<undefined>> {
		return this._initialize()
			.then(() => ({
				result: ActionExecutionResultCode.Ok,
			}))
			.catch(() => ({
				result: ActionExecutionResultCode.Error,
			}))
	}

	public async setSisyfosChannelState(
		payload: SetSisyfosChannelStatePayload
	): Promise<ActionExecutionResult<undefined>> {
		if (typeof payload?.channel !== 'number') {
			return {
				result: ActionExecutionResultCode.Error,
			}
		}
		this._sisyfos.setSisyfosChannel(payload.channel + 1, { ...this._getDeviceState().channels[payload.channel] })
		return {
			result: ActionExecutionResultCode.Ok,
		}
	}

	public async loadMixerPreset(payload: LoadMixerPresetPayload): Promise<ActionExecutionResult<undefined>> {
		if (!payload?.name) {
			return { result: ActionExecutionResultCode.Error, response: t('Missing name') }
		}
		if (!this._sisyfos.connected || !this._sisyfos.mixerOnline)
			return {
				result: ActionExecutionResultCode.Error,
			}
		this._sisyfos.send({
			type: SisyfosCommandType.LOAD_MIXER_PRESET,
			presetName: payload.name,
		})
		return {
			result: ActionExecutionResultCode.Ok,
		}
	}

	public readonly actions = this

	public async init(initOptions: SisyfosOptions): Promise<boolean> {
		this._sisyfos.once('initialized', () => {
			this.context.resetToState(this._getDeviceState(false))
		})

		this._sisyfos
			.connect(initOptions.host, initOptions.port)
			.catch((e) => this.logger.error('Failed to initialise Sisyfos connection', e))

		return true
	}

	public async terminate() {
		this._sisyfos.dispose()
		this._sisyfos.removeAllListeners()
	}

	public getStatus(): Omit<DeviceStatus, 'active'> {
		let statusCode = StatusCode.GOOD
		const messages: Array<string> = []

		if (!this._sisyfos.connected) {
			statusCode = StatusCode.BAD
			messages.push('Not connected')
		}

		if (!this._sisyfos.state && !this._isResyncPending) {
			statusCode = StatusCode.BAD
			messages.push(`Sisyfos device connection not initialized (restart required)`)
		}

		if (!this._sisyfos.mixerOnline) {
			statusCode = StatusCode.BAD
			messages.push(`Sisyfos has no connection to Audiomixer`)
		}
		return {
			statusCode: statusCode,
			messages: messages,
		}
	}

	private async _initialize(): Promise<void> {
		this._sisyfos.reInitialize()
		this._sisyfos.once('initialized', () => {
			this.context.resetToState(this._getDeviceState(false))
		})
	}

	private async _resync(): Promise<void> {
		if (this._isResyncPending) return
		this._isResyncPending = true
		// If state is still not reinitialised afer 5 seconds, we may have a problem.
		setTimeout(() => (this._isResyncPending = false), 5000)

		this._sisyfos.reInitialize()
		this._sisyfos.once('initialized', () => {
			this._isResyncPending = false

			this.context.setModifiedState((targetState) => {
				if (targetState) {
					return this._getDeviceState(false)
				}
				return false
			})
		})
	}

	get connected(): boolean {
		return this._sisyfos.connected
	}

	private _getDeviceState(isDefaultState = true, mappings?: Mappings): SisyfosState {
		let deviceStateFromAPI = this._sisyfos.state
		const deviceState: SisyfosState = {
			channels: {},
			resync: false,
		}

		if (!deviceStateFromAPI) deviceStateFromAPI = deviceState

		const channels = mappings
			? Object.values<Mapping<unknown>>(mappings || {})
					.filter(
						(m): m is Mapping<MappingSisyfosChannel> =>
							(m as Mapping<SomeMappingSisyfos>).options.mappingType === MappingSisyfosType.Channel
					)
					.map((m: Mapping<MappingSisyfosChannel>) => ({
						index: m.options.channel,
						disableDefaults: m.options.disableDefaults,
					}))
			: Object.keys(deviceStateFromAPI.channels).map((index) => ({ index, disableDefaults: true }))

		for (const ch of channels) {
			const channelFromAPI = deviceStateFromAPI.channels[ch.index]

			let channel: SisyfosChannel = {
				...channelFromAPI,
				timelineObjIds: [],
			}

			if (isDefaultState) {
				// reset values for default state
				channel = {
					...channel,
					...(ch.disableDefaults ? this._getBlankStateChannel() : this._getDefaultStateChannel()),
				}
			}

			deviceState.channels[ch.index] = channel
		}
		return deviceState
	}

	/** Returns a channel with defaults */
	private _getDefaultStateChannel(): SisyfosChannel {
		return {
			faderLevel: 0.75, // 0 dB
			pgmOn: 0,
			pstOn: 0,
			label: '',
			visible: true,
			muteOn: false,
			inputGain: 0.75,
			inputSelector: 1,
			timelineObjIds: [],
		}
	}

	/** Returns a channel without defaults */
	private _getBlankStateChannel(): SisyfosChannel {
		return {
			label: '',
			timelineObjIds: [],
			// we want those undefined properties to exist
			faderLevel: undefined,
			pgmOn: undefined,
			pstOn: undefined,
			visible: undefined,
			inputGain: undefined,
			inputSelector: undefined,
			muteOn: undefined,
		}
	}

	/**
	 * Transform the timeline state into a device state, which is in this case also
	 * a timeline state.
	 * @param state
	 */
	public convertTimelineStateToDeviceState(
		state: DeviceTimelineState<TSRTimelineContent>,
		mappings: Mappings
	): SisyfosState {
		const deviceState: SisyfosState = this._getDeviceState(true, mappings)

		// Set labels to layer names
		for (const mapping of Object.values<Mapping<unknown>>(mappings)) {
			const sisyfosMapping = mapping as Mapping<SomeMappingSisyfos>

			if (sisyfosMapping.options.mappingType !== MappingSisyfosType.Channel) continue

			if (!sisyfosMapping.options.setLabelToLayerName) continue

			if (!sisyfosMapping.layerName) continue

			let channel = deviceState.channels[sisyfosMapping.options.channel] as SisyfosChannel | undefined

			if (!channel) {
				channel = sisyfosMapping.options.disableDefaults ? this._getBlankStateChannel() : this._getDefaultStateChannel()
			}

			channel.label = sisyfosMapping.layerName

			deviceState.channels[sisyfosMapping.options.channel] = channel
		}

		// Preparation: put all channels that comes from the state in an array:
		const newChannels: ({
			overridePriority: number
			channel: number
			isLookahead: boolean
			timelineObjId: string
			triggerValue?: string
			disableDefaults?: boolean
		} & SisyfosChannelOptions)[] = []

		_.each(state.objects, (tlObject) => {
			let foundMapping = mappings[tlObject.layer] as Mapping<SomeMappingSisyfos> | undefined

			const content = tlObject.content as TimelineContentSisyfosAny

			// Allow resync without valid channel mapping
			if ('resync' in content && content.resync !== undefined) {
				deviceState.resync = deviceState.resync || content.resync
			}

			// Allow global retrigger without valid channel mapping
			if (
				'triggerValue' in content &&
				content.triggerValue !== undefined &&
				content.type === TimelineContentTypeSisyfos.TRIGGERVALUE
			) {
				deviceState.triggerValue = content.triggerValue
			}

			// if the tlObj is specifies to load to PST the original Layer is used to resolve the mapping
			if (!foundMapping && tlObject.isLookahead && tlObject.lookaheadForLayer) {
				foundMapping = mappings[tlObject.lookaheadForLayer] as Mapping<SomeMappingSisyfos> | undefined
			}

			if (!foundMapping) return

			// @ts-ignore backwards-compatibility:
			if (!foundMapping.mappingType) foundMapping.mappingType = MappingSisyfosType.CHANNEL
			// @ts-ignore backwards-compatibility:
			// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
			if (content.type === 'sisyfos') content.type = TimelineContentTypeSisyfos.CHANNEL

			debug(
				`Mapping ${foundMapping.layerName}: ${foundMapping.options.mappingType}, ${
					(foundMapping.options as any).channel || (foundMapping.options as any).label
				}`
			)

			if (
				foundMapping.options.mappingType === MappingSisyfosType.Channel &&
				content.type === TimelineContentTypeSisyfos.CHANNEL
			) {
				newChannels.push({
					...content,
					channel: foundMapping.options.channel,
					overridePriority: content.overridePriority || 0,
					isLookahead: tlObject.isLookahead || false,
					timelineObjId: tlObject.id,
					triggerValue: content.triggerValue,
					disableDefaults: foundMapping.options.disableDefaults,
				})
				deviceState.resync = deviceState.resync || content.resync || false
			} else if (
				foundMapping.options.mappingType === MappingSisyfosType.ChannelByLabel &&
				content.type === TimelineContentTypeSisyfos.CHANNEL
			) {
				const ch = this._sisyfos.getChannelByLabel(foundMapping.options.label)
				debug(`Channel by label ${foundMapping.options.label}(${ch}): ${content.isPgm}`)
				if (ch === undefined) return

				newChannels.push({
					...content,
					channel: ch,
					overridePriority: content.overridePriority || 0,
					isLookahead: tlObject.isLookahead || false,
					timelineObjId: tlObject.id,
					triggerValue: content.triggerValue,
					disableDefaults: foundMapping.options.disableDefaults,
				})
				deviceState.resync = deviceState.resync || content.resync || false
			} else if (
				foundMapping.options.mappingType === MappingSisyfosType.Channels &&
				content.type === TimelineContentTypeSisyfos.CHANNELS
			) {
				for (const channel of content.channels) {
					const referencedMapping = mappings[channel.mappedLayer] as Mapping<SomeMappingSisyfos> | undefined
					if (!referencedMapping) continue

					let channelNumber: number | undefined
					if (referencedMapping.options.mappingType === MappingSisyfosType.Channel) {
						channelNumber = referencedMapping.options.channel
					} else if (referencedMapping.options.mappingType === MappingSisyfosType.ChannelByLabel) {
						channelNumber = this._sisyfos.getChannelByLabel(referencedMapping.options.label)
						debug(`Channel by label ${referencedMapping.options.label}(${channelNumber}): ${channel.isPgm}`)
					}

					if (channelNumber === undefined) continue

					newChannels.push({
						...channel,
						channel: channelNumber,
						overridePriority: content.overridePriority || 0,
						isLookahead: tlObject.isLookahead || false,
						timelineObjId: tlObject.id,
						triggerValue: content.triggerValue,
						disableDefaults: foundMapping.options.disableDefaults,
					})
				}
				deviceState.resync = deviceState.resync || content.resync || false
			}
		})

		// Sort by overridePriority, so that those with highest overridePriority will be applied last
		_.each(
			_.sortBy(newChannels, (channel) => channel.overridePriority),
			(newChannel) => {
				if (!deviceState.channels[newChannel.channel]) {
					deviceState.channels[newChannel.channel] = newChannel.disableDefaults
						? this._getBlankStateChannel()
						: this._getDefaultStateChannel()
				}
				const channel = deviceState.channels[newChannel.channel]

				if (newChannel.isPgm !== undefined) {
					if (newChannel.isLookahead) {
						channel.pstOn = newChannel.isPgm || 0
					} else {
						channel.pgmOn = newChannel.isPgm || 0
					}
				}

				if (newChannel.faderLevel !== undefined) channel.faderLevel = newChannel.faderLevel
				if (newChannel.label !== undefined && newChannel.label !== '') channel.label = newChannel.label
				if (newChannel.visible !== undefined) channel.visible = newChannel.visible
				if (newChannel.fadeTime !== undefined) channel.fadeTime = newChannel.fadeTime
				if (newChannel.muteOn !== undefined) channel.muteOn = newChannel.muteOn
				if (newChannel.inputGain !== undefined) channel.inputGain = newChannel.inputGain
				if (newChannel.inputSelector !== undefined) channel.inputSelector = newChannel.inputSelector
				if (newChannel.triggerValue !== undefined) channel.triggerValue = newChannel.triggerValue

				channel.timelineObjIds.push(newChannel.timelineObjId)
			}
		)
		return deviceState
	}

	/**
	 * Compares the new timeline-state with the old one, and generates commands to account for the difference
	 */
	public diffStates(oldSisyfosState: SisyfosState | undefined, newSisyfosState: SisyfosState): Command[] {
		const commands: Command[] = []

		if (newSisyfosState.resync && !oldSisyfosState?.resync) {
			commands.push({
				context: `Resyncing with Sisyfos`,
				command: {
					type: SisyfosCommandType.RESYNC,
				},
				timelineObjId: '',
			})
		}

		_.each(newSisyfosState.channels, (newChannel: SisyfosChannel, index) => {
			const oldChannel: SisyfosChannel | undefined = oldSisyfosState?.channels[index]

			if (newSisyfosState.triggerValue && newSisyfosState.triggerValue !== oldSisyfosState?.triggerValue) {
				// || (!oldChannel && Number(index) >= 0)) {
				// push commands for everything
				debug('reset channel ' + index)
				commands.push({
					context: `Channel ${index} reset`,
					command: {
						type: SisyfosCommandType.SET_CHANNEL,
						channel: Number(index),
						values: newChannel,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
				return
			}

			if (newChannel.triggerValue && oldChannel?.triggerValue !== newChannel.triggerValue) {
				// note - should we only do this if we have an oldchannel?
				debug('reset channel ' + index)
				commands.push({
					context: `Channel ${index} reset`,
					command: {
						type: SisyfosCommandType.SET_CHANNEL,
						channel: Number(index),
						values: newChannel,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
				return
			}

			if (!oldChannel) return

			if (oldChannel.pgmOn !== newChannel.pgmOn && newChannel.pgmOn !== undefined) {
				debug(`Channel ${index} pgm goes from "${oldChannel.pgmOn}" to "${newChannel.pgmOn}"`)
				const values: number[] = [newChannel.pgmOn]
				if (newChannel.fadeTime) {
					values.push(newChannel.fadeTime)
				}
				commands.push({
					context: `Channel ${index} pgm goes from "${oldChannel.pgmOn}" to "${newChannel.pgmOn}"`,
					command: {
						type: SisyfosCommandType.TOGGLE_PGM,
						channel: Number(index),
						values,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
			}

			if (oldChannel.pstOn !== newChannel.pstOn && newChannel.pstOn !== undefined) {
				debug(`Channel ${index} pst goes from "${oldChannel.pstOn}" to "${newChannel.pstOn}"`)
				commands.push({
					context: `Channel ${index} pst goes from "${oldChannel.pstOn}" to "${newChannel.pstOn}"`,
					command: {
						type: SisyfosCommandType.TOGGLE_PST,
						channel: Number(index),
						value: newChannel.pstOn,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
			}

			if (oldChannel.faderLevel !== newChannel.faderLevel && newChannel.faderLevel !== undefined) {
				debug(`change faderLevel ${index}: "${newChannel.faderLevel}"`)
				const values: number[] = [newChannel.faderLevel]
				if (newChannel.fadeTime) {
					values.push(newChannel.fadeTime)
				}
				commands.push({
					context: 'faderLevel change',
					command: {
						type: SisyfosCommandType.SET_FADER,
						channel: Number(index),
						values,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
			}

			newChannel.label = newChannel.label || oldChannel.label
			if (newChannel.label !== '' && oldChannel.label !== newChannel.label) {
				debug(`set label on fader ${index}: "${newChannel.label}"`)
				commands.push({
					context: 'set label on fader',
					command: {
						type: SisyfosCommandType.LABEL,
						channel: Number(index),
						value: newChannel.label,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
			}

			if (oldChannel.visible !== newChannel.visible && newChannel.visible !== undefined) {
				debug(`Channel ${index} Visibility goes from "${oldChannel.visible}" to "${newChannel.visible}"`)
				commands.push({
					context: `Channel ${index} Visibility goes from "${oldChannel.visible}" to "${newChannel.visible}"`,
					command: {
						type: SisyfosCommandType.VISIBLE,
						channel: Number(index),
						value: newChannel.visible,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
			}

			if (oldChannel.muteOn !== newChannel.muteOn && newChannel.muteOn !== undefined) {
				debug(`Channel ${index} mute goes from "${oldChannel.muteOn}" to "${newChannel.muteOn}"`)
				commands.push({
					context: `Channel ${index} mute goes from "${oldChannel.muteOn}" to "${newChannel.muteOn}"`,
					command: {
						type: SisyfosCommandType.SET_MUTE,
						channel: Number(index),
						value: newChannel.muteOn,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
			}

			if (oldChannel.inputGain !== newChannel.inputGain && newChannel.inputGain !== undefined) {
				debug(`Channel ${index} inputGain goes from "${oldChannel.inputGain}" to "${newChannel.inputGain}"`)
				commands.push({
					context: `Channel ${index} inputGain goes from "${oldChannel.inputGain}" to "${newChannel.inputGain}"`,
					command: {
						type: SisyfosCommandType.SET_INPUT_GAIN,
						channel: Number(index),
						value: newChannel.inputGain,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
			}

			if (oldChannel.inputSelector !== newChannel.inputSelector && newChannel.inputSelector !== undefined) {
				debug(`Channel ${index} inputSelector goes from "${oldChannel.inputSelector}" to "${newChannel.inputSelector}"`)
				commands.push({
					context: `Channel ${index} inputSelector goes from "${oldChannel.inputSelector}" to "${newChannel.inputSelector}"`,
					command: {
						type: SisyfosCommandType.SET_INPUT_SELECTOR,
						channel: Number(index),
						value: newChannel.inputSelector,
					},
					timelineObjId: newChannel.timelineObjIds[0] || '',
				})
			}
		})

		return commands
	}

	public async sendCommand(command: Command): Promise<void> {
		this.logger.debug(command)

		if (command.command.type === SisyfosCommandType.RESYNC) {
			return this._resync()
		} else {
			try {
				this._sisyfos.send(command.command)

				return Promise.resolve()
			} catch (e) {
				return Promise.reject(e as Error)
			}
		}
	}

	private _connectionChanged() {
		this.context.connectionChanged(this.getStatus())
	}
}
