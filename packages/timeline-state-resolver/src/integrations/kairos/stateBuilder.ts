import { KairosState, KairosStateUtil, Enums, MacroState, VideoState } from 'kairos-connection'
import {
	Mapping,
	SomeMappingKairos,
	DeviceType,
	MappingKairosType,
	TimelineContentTypeKairos,
	Mappings,
	TSRTimelineContent,
	Timeline,
	KairosTransitionStyle,
	TimelineContentKairosME,
	MappingKairosMixEffect,
	TimelineContentKairosDSK,
	TimelineContentKairosSsrcProps,
	TimelineContentKairosAUX,
	TimelineContentKairosMediaPlayer,
	TimelineContentKairosAudioChannel,
	TimelineContentKairosSsrc,
	TimelineContentKairosMacroPlayer,
	MappingKairosMacroPlayer,
	MappingKairosAudioChannel,
	MappingKairosMediaPlayer,
	MappingKairosAuxilliary,
	MappingKairosSuperSourceBox,
	MappingKairosSuperSourceProperties,
	MappingKairosDownStreamKeyer,
	MappingKairosAudioRouting,
	TimelineContentKairosAudioRouting,
	MappingKairosColorGenerator,
	TimelineContentKairosColorGenerator,
} from 'timeline-state-resolver-types'
import _ = require('underscore')
import { Defaults, State as DeviceState, Defaults as StateDefault } from 'kairos-state'
import { assertNever, cloneDeep, deepMerge, literal } from '../../lib'
import { PartialDeep } from 'type-fest'

export type InternalKairosConnectionState = KairosState & { controlValues?: Record<string, string> }

export class KairosStateBuilder {
	// Start out with default state:
	readonly #deviceState: InternalKairosConnectionState = KairosStateUtil.Create()

	public static fromTimeline(timelineState: Timeline.StateInTime<TSRTimelineContent>, mappings: Mappings): DeviceState {
		const builder = new KairosStateBuilder()

		// Sort layer based on Layer name
		const sortedLayers = _.map(timelineState, (tlObject, layerName) => ({ layerName, tlObject })).sort((a, b) =>
			a.layerName.localeCompare(b.layerName)
		)

		// For every layer, augment the state
		_.each(sortedLayers, ({ tlObject, layerName }) => {
			const content = tlObject.content

			const mapping = mappings[layerName] as Mapping<SomeMappingKairos> | undefined

			if (mapping && content.deviceType === DeviceType.KAIROS) {
				switch (mapping.options.mappingType) {
					case MappingKairosType.MixEffect:
						if (content.type === TimelineContentTypeKairos.ME) {
							builder._applyMixEffect(mapping.options, content)
							builder._setControlValue(builder._getMixEffectAddressesFromTlObject(mapping.options, content), tlObject)
						}
						break
					case MappingKairosType.DownStreamKeyer:
						if (content.type === TimelineContentTypeKairos.DSK) {
							builder._applyDownStreamKeyer(mapping.options, content)
							builder._setControlValue(['video.dsk.' + mapping.options.index], tlObject)
						}
						break
					case MappingKairosType.SuperSourceBox:
						if (content.type === TimelineContentTypeKairos.SSRC) {
							builder._applySuperSourceBox(mapping.options, content)
							builder._setControlValue(['video.superSource.' + mapping.options.index], tlObject)
						}
						break
					case MappingKairosType.SuperSourceProperties:
						if (content.type === TimelineContentTypeKairos.SSRCPROPS) {
							builder._applySuperSourceProperties(mapping.options, content)
							builder._setControlValue(['video.superSource.' + mapping.options.index], tlObject)
						}
						break
					case MappingKairosType.Auxilliary:
						if (content.type === TimelineContentTypeKairos.AUX) {
							builder._applyAuxilliary(mapping.options, content)
						}
						break
					case MappingKairosType.MediaPlayer:
						if (content.type === TimelineContentTypeKairos.MEDIAPLAYER) {
							builder._applyMediaPlayer(mapping.options, content)
						}
						break
					case MappingKairosType.AudioChannel:
						if (content.type === TimelineContentTypeKairos.AUDIOCHANNEL) {
							builder._applyAudioChannel(mapping.options, content)
						}
						break
					case MappingKairosType.AudioRouting:
						if (content.type === TimelineContentTypeKairos.AUDIOROUTING) {
							builder._applyAudioRouting(mapping.options, content)
						}
						break
					case MappingKairosType.MacroPlayer:
						if (content.type === TimelineContentTypeKairos.MACROPLAYER) {
							builder._applyMacroPlayer(mapping.options, content)
						}
						break
					case MappingKairosType.ColorGenerator:
						if (content.type === TimelineContentTypeKairos.COLORGENERATOR) {
							builder._applyColorGenerator(mapping.options, content)
						}
						break
					case MappingKairosType.ControlValue:
						break
					default:
						assertNever(mapping.options)
						break
				}
			}
		})

		return builder.#deviceState
	}

	private _isAssignableToNextStyle(transition: KairosTransitionStyle | undefined): boolean {
		return (
			transition !== undefined && transition !== KairosTransitionStyle.DUMMY && transition !== KairosTransitionStyle.CUT
		)
	}

	private _applyMixEffect(mapping: MappingKairosMixEffect, content: TimelineContentKairosME): void {
		if (typeof mapping.index !== 'number' || mapping.index < 0) return

		const stkairosixEffect = deepMerge(
			KairosStateUtil.getMixEffect(this.#deviceState, mapping.index),
			_.omit(content.me, 'upstreamKeyers', 'transitionPosition')
		)
		this.#deviceState.video.mixEffects[mapping.index] = stkairosixEffect
		if (content.me.transitionPosition !== undefined) {
			stkairosixEffect.transitionPosition = {
				handlePosition: content.me.transitionPosition,

				// Readonly properties
				inTransition: false,
				remainingFrames: 0,
			}
		}

		const objectTransition = content.me.transition
		if (this._isAssignableToNextStyle(objectTransition)) {
			stkairosixEffect.transitionProperties.nextStyle = objectTransition as number as Enums.TransitionStyle
		}

		const objectKeyers = content.me.upstreamKeyers
		if (objectKeyers) {
			for (const objKeyer of objectKeyers) {
				const fixedObjKeyer: PartialDeep<VideoState.USK.UpstreamKeyer> = {
					...objKeyer,
					flyKeyframes: [undefined, undefined],
					flyProperties: undefined,
				}
				delete fixedObjKeyer.flyProperties
				delete fixedObjKeyer.flyKeyframes

				if (objKeyer.flyProperties) {
					fixedObjKeyer.flyProperties = {
						isASet: false,
						isBSet: false,
						isAtKeyFrame: objKeyer.flyProperties.isAtKeyFrame as number,
						runToInfiniteIndex: objKeyer.flyProperties.runToInfiniteIndex,
					}
				}

				stkairosixEffect.upstreamKeyers[objKeyer.upstreamKeyerId] = deepMerge<VideoState.USK.UpstreamKeyer>(
					KairosStateUtil.getUpstreamKeyer(stkairosixEffect, objKeyer.upstreamKeyerId),
					fixedObjKeyer
				)

				const keyer = stkairosixEffect.upstreamKeyers[objKeyer.upstreamKeyerId]
				if (objKeyer.flyKeyframes && keyer) {
					keyer.flyKeyframes = [keyer.flyKeyframes[0] ?? undefined, keyer.flyKeyframes[1] ?? undefined]
					if (objKeyer.flyKeyframes[0]) {
						keyer.flyKeyframes[0] = literal<VideoState.USK.UpstreamKeyerFlyKeyframe>({
							...StateDefault.Video.flyKeyframe(0),
							...objKeyer.flyKeyframes[0],
						})
					}
					if (objKeyer.flyKeyframes[1]) {
						keyer.flyKeyframes[1] = literal<VideoState.USK.UpstreamKeyerFlyKeyframe>({
							...StateDefault.Video.flyKeyframe(1),
							...objKeyer.flyKeyframes[1],
						})
					}
				}
			}
		}
	}

	private _applyDownStreamKeyer(mapping: MappingKairosDownStreamKeyer, content: TimelineContentKairosDSK): void {
		if (typeof mapping.index !== 'number' || mapping.index < 0) return

		this.#deviceState.video.downstreamKeyers[mapping.index] = deepMerge<VideoState.DSK.DownstreamKeyer>(
			KairosStateUtil.getDownstreamKeyer(this.#deviceState, mapping.index),
			content.dsk
		)
	}

	private _applySuperSourceBox(mapping: MappingKairosSuperSourceBox, content: TimelineContentKairosSsrc): void {
		if (typeof mapping.index !== 'number' || mapping.index < 0) return

		const stateSuperSource = KairosStateUtil.getSuperSource(this.#deviceState, mapping.index)

		content.ssrc.boxes.forEach((objBox, i) => {
			stateSuperSource.boxes[i] = deepMerge<VideoState.SuperSource.SuperSourceBox>(
				stateSuperSource.boxes[i] ?? cloneDeep(StateDefault.Video.SuperSourceBox),
				objBox
			)
		})
	}

	private _applySuperSourceProperties(
		mapping: MappingKairosSuperSourceProperties,
		content: TimelineContentKairosSsrcProps
	): void {
		const stateSuperSource = KairosStateUtil.getSuperSource(this.#deviceState, mapping.index)

		const borderKeys = [
			'borderEnabled',
			'borderBevel',
			'borderOuterWidth',
			'borderInnerWidth',
			'borderOuterSoftness',
			'borderInnerSoftness',
			'borderBevelSoftness',
			'borderBevelPosition',
			'borderHue',
			'borderSaturation',
			'borderLuma',
			'borderLightSourceDirection',
			'borderLightSourceAltitude',
		]

		stateSuperSource.properties = deepMerge(
			stateSuperSource.properties ?? cloneDeep(StateDefault.Video.SuperSourceProperties),
			_.omit(content.ssrcProps, ...borderKeys)
		)

		stateSuperSource.border = deepMerge(
			stateSuperSource.border ?? cloneDeep(StateDefault.Video.SuperSourceBorder),
			_.pick(content.ssrcProps, ...borderKeys)
		)
	}

	private _applyAuxilliary(mapping: MappingKairosAuxilliary, content: TimelineContentKairosAUX): void {
		if (typeof mapping.index !== 'number' || mapping.index < 0) return

		this.#deviceState.video.auxilliaries[mapping.index] = content.aux.input
	}

	private _applyMediaPlayer(mapping: MappingKairosMediaPlayer, content: TimelineContentKairosMediaPlayer): void {
		if (typeof mapping.index !== 'number' || mapping.index < 0) return

		this.#deviceState.media.players[mapping.index] = deepMerge(
			KairosStateUtil.getMediaPlayer(this.#deviceState, mapping.index),
			content.mediaPlayer
		)
	}

	private _applyAudioChannel(mapping: MappingKairosAudioChannel, content: TimelineContentKairosAudioChannel): void {
		if (typeof mapping.index !== 'number' || mapping.index < 0) return

		if (!this.#deviceState.audio) this.#deviceState.audio = { channels: {} }

		const stateAudioChannel = this.#deviceState.audio.channels[mapping.index] ?? StateDefault.ClassicAudio.Channel
		this.#deviceState.audio.channels[mapping.index] = {
			...cloneDeep(stateAudioChannel),
			...content.audioChannel,
		}
	}

	private _applyAudioRouting(mapping: MappingKairosAudioRouting, content: TimelineContentKairosAudioRouting): void {
		if (typeof mapping.index !== 'number' || mapping.index < 0) return

		// lazily generate the state properties, to make this be opt in per-mapping
		if (!this.#deviceState.fairlight) this.#deviceState.fairlight = { inputs: {} }
		if (!this.#deviceState.fairlight.audioRouting)
			this.#deviceState.fairlight.audioRouting = {
				sources: {},
				outputs: {},
			}

		this.#deviceState.fairlight.audioRouting.outputs[mapping.index] = {
			// readonly props, they won't be diffed
			audioOutputId: mapping.index,
			audioChannelPair: 0,
			externalPortType: 0,
			internalPortType: 0,

			// mutable props
			name: `Output ${mapping.index}`,
			...content.audioRouting,
		}
	}

	private _applyMacroPlayer(_mapping: MappingKairosMacroPlayer, content: TimelineContentKairosMacroPlayer): void {
		this.#deviceState.macro.macroPlayer = deepMerge<MacroState.MacroPlayerState>(
			this.#deviceState.macro.macroPlayer,
			content.macroPlayer
		)
	}

	private _applyColorGenerator(
		mapping: MappingKairosColorGenerator,
		content: TimelineContentKairosColorGenerator
	): void {
		if (!this.#deviceState.colorGenerators) this.#deviceState.colorGenerators = {}
		this.#deviceState.colorGenerators[mapping.index] = {
			...Defaults.Color.ColorGenerator,
			...this.#deviceState.colorGenerators[mapping.index],
			...content.colorGenerator,
		}
	}

	private _setControlValue(addresses: string[], tlObject: Timeline.ResolvedTimelineObjectInstance<TSRTimelineContent>) {
		if (!this.#deviceState.controlValues) this.#deviceState.controlValues = {}

		for (const a of addresses) {
			const oldValue = this.#deviceState[a]
			this.#deviceState.controlValues[a] =
				Math.max(
					tlObject.instance.start,
					tlObject.instance.originalStart ?? 0,
					tlObject.lastModified ?? 0,
					oldValue ?? 0
				) + ''
		}
	}

	private _getMixEffectAddressesFromTlObject(
		mapping: MappingKairosMixEffect,
		content: TimelineContentKairosME
	): string[] {
		const addresses: string[] = []

		if ('input' in content.me || 'programInput' in content.me) {
			addresses.push('video.mixEffects.' + mapping.index + '.pgm')
		}

		if ('previewInput' in content.me || 'transition' in content.me) {
			addresses.push('video.mixEffects.' + mapping.index + '.base')
		}

		if ('transitionSettings' in content.me) {
			addresses.push('video.mixEffects.' + mapping.index + '.transitionSettings')
		}

		if (content.me.upstreamKeyers) {
			addresses.push(
				...content.me.upstreamKeyers
					.filter((usk) => !!usk)
					.map((usk) => 'video.mixEffects.' + mapping.index + '.usk.' + usk.upstreamKeyerId)
			)
		}

		return addresses
	}
}
