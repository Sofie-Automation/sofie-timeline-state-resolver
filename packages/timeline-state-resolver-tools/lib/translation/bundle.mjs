/**
 * This script will read and bundle the translations in the project's .po files.
 * It is intended to be used by the Webpack config script.
 */
/* eslint-disable */
import { readdir, readFile } from 'node:fs/promises'
import { join, basename, dirname } from 'node:path'
import { gettextToI18next } from 'i18next-conv'

import { conversionOptions } from './config.mjs'

const reverseHack = !!process.env.GENERATE_REVERSE_ENGLISH

async function processPoFile(filePath) {
	const start = Date.now()
	// filePath is like locales/nb/timeline-state-resolver.po
	const language = basename(dirname(filePath))
	const namespace = basename(filePath, '.po')

	const poFile = await readFile(filePath, 'utf-8')

	const converted = await gettextToI18next(language, poFile, {
		...conversionOptions,
		language,
		// Keys with no value will fall back to default bundle, and eventually the key itself will
		// be used as value if no values are found. Since we use the string as key, this means
		// untranslated keys will be represented by their original (English) text. This is not great
		// but better than inserting empty strings everywhere.
		skipUntranslated: !reverseHack || language !== 'en',
		ns: namespace,
	})

	const data = JSON.parse(converted)

	console.info(
		`Processed ${namespace} ${language} (${Object.keys(data).length} translated keys) (${Date.now() - start} ms)`
	)

	if (reverseHack && language === 'en') {
		for (const key of Object.keys(data)) {
			data[key] = key.split('').reverse().join('')
		}
	}

	return { type: 'i18next', language, namespace, data }
}

function mergeByLanguage(translations) {
	const languages = {}

	for (const { language, data } of translations) {
		if (!languages[language]) {
			languages[language] = data
		} else {
			Object.assign(languages[language], data)
		}
	}

	return Object.keys(languages).map((language) => ({ language, data: languages[language], type: 'i18next' }))
}

export async function getTranslations(sources) {
	const resolvedSources = new Set()
	for (const source of sources) {
		resolvedSources.add(source.root)
		for (const ref of source.refs || []) {
			resolvedSources.add(ref)
		}
	}

	console.info('Bundling translations...')

	// Find all .po files under locales/ matching the requested source names
	let localeEntries
	try {
		localeEntries = await readdir('locales', { recursive: true })
	} catch {
		throw new Error(
			'Failed to read locales directory. Make sure to run the extraction step first and that the locales/ directory exists.'
		)
	}

	const poFiles = localeEntries
		.filter((f) => f.endsWith('.po') && resolvedSources.has(basename(f, '.po')))
		.map((f) => join('locales', f))

	const translations = await Promise.all(poFiles.map(processPoFile))

	console.info('Translations bundling complete.')

	return mergeByLanguage(translations)
}
