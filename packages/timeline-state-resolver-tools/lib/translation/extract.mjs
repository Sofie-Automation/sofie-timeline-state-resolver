/**
 * This script will extract keys from the source code (provided they are wrapped
 * in a call to the (mock) i18next translation function t()).
 * The extracted keys are written to .po files, one for each specified locale.
 *
 * Translations in already existing .po files will be preserved.
 */

import { parse, join } from 'node:path'
import { writeFile, readFile, readdir } from 'node:fs/promises'
import { runExtractor } from 'i18next-cli'
import { i18nextToPo, gettextToI18next } from 'i18next-conv'

import { conversionOptions } from './config.mjs'
import { extractKeysFromJson } from './jsonLexer.mjs'

export async function extractTranslations(packageName, sourcePath) {
	const start = Date.now()
	console.info(`\nExtracting keys from ${packageName} (${sourcePath})...`)
	const entryPointRoot = parse(sourcePath).dir
	const locales = ['en', 'nb', 'nn', 'sv']
	const outputPattern = `locales/{{language}}/${packageName}.json`

	const extractionStats = { keysExtracted: 0, locales: [] }

	await runExtractor({
		locales,
		extract: {
			input: [`${entryPointRoot}/**/*.ts`],
			output: outputPattern,
			sort: true,
			nsSeparator: false,
			keySeparator: false,
			defaultValue: '',
			removeUnusedKeys: true,
			mergeNamespaces: true,
			functions: ['t', 'generateTranslation'],
		},
		plugins: [jsonToPoPlugin('translation', extractionStats), jsonSchemaPlugin(entryPointRoot)],
	})

	const taskDuration = Date.now() - start
	const { keysExtracted } = extractionStats
	if (keysExtracted) {
		console.info(`=> OK, ${keysExtracted} keys extracted in ${taskDuration} ms`)
		for (const { language, keysMerged, keysRemoved } of extractionStats.locales) {
			console.info(
				`\t${language}: added ${keysExtracted - keysMerged} new keys, merged ${keysMerged} existing translations, removed ${keysRemoved} obsolete keys`
			)
		}
	} else {
		console.info(`=> No keys found in ${taskDuration}ms`)
	}
}

function jsonToPoPlugin(translationNamespace, extractionStats) {
	return {
		name: 'json-to-po',
		async afterSync(results) {
			await Promise.all(
				results.map(async (result) => {
					const language = result.path.split(/[/\\]/).at(-2)
					const poPath = result.path.replace(/\.json$/, '.po')

					// Load existing translations from the .po file if it exists
					let existingTranslations = {}
					try {
						const existingPo = await readFile(poPath, 'utf-8')
						const converted = await gettextToI18next(language, existingPo, {
							...conversionOptions,
							language,
							skipUntranslated: true,
						})
						existingTranslations = JSON.parse(converted)
					} catch {
						// No existing .po file or parse error - start fresh
					}

					// Merge: use existing translations for known keys, empty string for new keys
					const newTranslations = result.newTranslations[translationNamespace]
					const newKeys = Object.keys(newTranslations)
					const merged = {}
					let keysMerged = 0
					for (const key of newKeys) {
						const existing = existingTranslations[key]
						if (existing) {
							merged[key] = existing
							keysMerged++
						} else {
							merged[key] = ''
						}
					}
					const keysRemoved = Object.keys(existingTranslations).length - keysMerged

					extractionStats.keysExtracted = newKeys.length
					extractionStats.locales.push({ language, keysMerged, keysRemoved })

					const poContent = await i18nextToPo(language, JSON.stringify(merged), {
						...conversionOptions,
						language,
						skipUntranslated: false,
					})
					await writeFile(poPath, poContent)
				})
			)
		},
	}
}

function jsonSchemaPlugin(entryPointRoot) {
	return {
		name: 'json-schema-lexer',
		async onEnd(keys) {
			let allFiles
			try {
				allFiles = await readdir(entryPointRoot, { recursive: true })
			} catch {
				return
			}
			const schemaFiles = allFiles.filter((f) => f.includes('$schemas') && f.endsWith('.json'))
			for (const relPath of schemaFiles) {
				const fullPath = join(entryPointRoot, relPath)
				let content
				try {
					content = await readFile(fullPath, 'utf-8')
				} catch {
					continue
				}
				const extractedKeys = extractKeysFromJson(content, fullPath)
				for (const key of extractedKeys) {
					keys.set(`translation:${key}`, {
						key,
						defaultValue: '',
						ns: 'translation',
					})
				}
			}
		},
	}
}
