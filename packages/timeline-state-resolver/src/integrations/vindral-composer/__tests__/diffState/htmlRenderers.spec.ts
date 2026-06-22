import { DeviceType, TimelineContentTypeVindralComposer } from 'timeline-state-resolver-types'
import { EMPTY_STATE, MAPPINGS } from '../lib.js'
import { compareStates, diffVindralStates, makeState } from './helpers.js'

describe('diffState — html renderers', () => {
	const HTML_SELECTOR = { target: 'html-guid' }

	const htmlObj = (html: { url?: string; running?: boolean; reloadKey?: string | number }) => ({
		enable: { start: 0 },
		id: 'obj0',
		layer: 'htmlLayer',
		content: {
			deviceType: DeviceType.VINDRAL_COMPOSER,
			type: TimelineContentTypeVindralComposer.HTML,
			html,
		} as const,
	})

	test('new html renderer with url → StopCommand, set-property, StartCommand (running defaults to true)', () => {
		// running defaults to true when omitted, so the renderer is started after the URL is applied.
		compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([htmlObj({ url: 'https://example.com' })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
			},
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: {
					type: 'set-property',
					selector: HTML_SELECTOR,
					property: 'WebPageRendererUrl',
					value: 'https://example.com',
				},
			},
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
			},
		])
	})

	test('unchanged html renderer → no commands', () => {
		const s = makeState([htmlObj({ url: 'https://example.com', running: true })])
		compareStates(MAPPINGS, s, s, [])
	})

	test('url changed → StopCommand, set-property, StartCommand (running defaults to true)', () => {
		// Both states default running to true, so the URL change forces a Stop→setUrl→Start cycle.
		compareStates(
			MAPPINGS,
			makeState([htmlObj({ url: 'https://old.com' })]),
			makeState([htmlObj({ url: 'https://new.com' })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: HTML_SELECTOR,
						property: 'WebPageRendererUrl',
						value: 'https://new.com',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
				},
			]
		)
	})

	test('running=true appears → StartCommand', () => {
		compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([htmlObj({ running: true })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
			},
		])
	})

	test('running=false appears → StopCommand', () => {
		compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([htmlObj({ running: false })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
			},
		])
	})

	test('running true → false → StopCommand', () => {
		compareStates(MAPPINGS, makeState([htmlObj({ running: true })]), makeState([htmlObj({ running: false })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
			},
		])
	})

	test('running false → true → StartCommand', () => {
		compareStates(MAPPINGS, makeState([htmlObj({ running: false })]), makeState([htmlObj({ running: true })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
			},
		])
	})

	test('reloadKey changes → ReloadCommand', () => {
		compareStates(MAPPINGS, makeState([htmlObj({ reloadKey: 1 })]), makeState([htmlObj({ reloadKey: 2 })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'ReloadCommand' },
			},
		])
	})

	test('reloadKey appears on first object → StartCommand (running defaults to true) then ReloadCommand', () => {
		compareStates(MAPPINGS, { ...EMPTY_STATE, stateTime: 0 }, makeState([htmlObj({ reloadKey: 'v1' })]), [
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
			},
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'ReloadCommand' },
			},
		])
	})

	test('reloadKey unchanged → no ReloadCommand', () => {
		compareStates(MAPPINGS, makeState([htmlObj({ reloadKey: 1 })]), makeState([htmlObj({ reloadKey: 1 })]), [])
	})

	test('url changed while running → StopCommand, set-property, StartCommand', () => {
		compareStates(
			MAPPINGS,
			makeState([htmlObj({ url: 'https://old.com', running: true })]),
			makeState([htmlObj({ url: 'https://new.com', running: true })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: HTML_SELECTOR,
						property: 'WebPageRendererUrl',
						value: 'https://new.com',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
				},
			]
		)
	})

	test('url changed while running + reloadKey changes → StopCommand, set-property, StartCommand (no redundant ReloadCommand)', () => {
		compareStates(
			MAPPINGS,
			makeState([htmlObj({ url: 'https://old.com', running: true, reloadKey: 1 })]),
			makeState([htmlObj({ url: 'https://new.com', running: true, reloadKey: 2 })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: HTML_SELECTOR,
						property: 'WebPageRendererUrl',
						value: 'https://new.com',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
				},
			]
		)
	})

	test('url changed while not running → StopCommand then set-property, no restart', () => {
		compareStates(
			MAPPINGS,
			makeState([htmlObj({ url: 'https://old.com', running: false })]),
			makeState([htmlObj({ url: 'https://new.com', running: false })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: HTML_SELECTOR,
						property: 'WebPageRendererUrl',
						value: 'https://new.com',
					},
				},
			]
		)
	})

	test('url changed + running true→false → StopCommand, set-property, StopCommand', () => {
		compareStates(
			MAPPINGS,
			makeState([htmlObj({ url: 'https://old.com', running: true })]),
			makeState([htmlObj({ url: 'https://new.com', running: false })]),
			[
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: {
						type: 'set-property',
						selector: HTML_SELECTOR,
						property: 'WebPageRendererUrl',
						value: 'https://new.com',
					},
				},
				{
					timelineObjId: 'obj0',
					context: expect.any(String),
					command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
				},
			]
		)
	})

	test('html renderer removed → no commands', () => {
		compareStates(
			MAPPINGS,
			makeState([htmlObj({ url: 'https://example.com', running: true })]),
			{ ...EMPTY_STATE, stateTime: 0 },
			[]
		)
	})

	test('url + running appear together → StopCommand, set-property, StartCommand (no redundant ReloadCommand)', () => {
		const commands = diffVindralStates(
			{ ...EMPTY_STATE, stateTime: 0 },
			makeState([htmlObj({ url: 'https://example.com', running: true, reloadKey: 1 })]),
			MAPPINGS
		)
		expect(commands).toStrictEqual([
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StopCommand' },
			},
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: {
					type: 'set-property',
					selector: HTML_SELECTOR,
					property: 'WebPageRendererUrl',
					value: 'https://example.com',
				},
			},
			{
				timelineObjId: 'obj0',
				context: expect.any(String),
				command: { type: 'invoke-command', selector: HTML_SELECTOR, command: 'StartCommand' },
			},
		])
	})
})
