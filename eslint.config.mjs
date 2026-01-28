// @ts-check

import { generateEslintConfig } from '@sofie-automation/code-standard-preset/eslint/main.mjs'

const extendedRules = await generateEslintConfig({
	// ignores: ['vitest.config.ts'],
	// testRunner: 'vitest',
})

extendedRules.push({
	files: ['./packages/timeline-state-resolver/**/*.ts'],
	rules: {
		// Temporary disable rules
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/no-non-null-assertion': 0,
		'@typescript-eslint/ban-ts-comment': 0,
		'@typescript-eslint/no-namespace': 0,
	},
})

// Some specific rules for the tools, which are less strict
extendedRules.push({
	files: ['./packages/timeline-state-resolver-tools/bin/*.mjs'],
	rules: {
		'n/no-unpublished-bin': 0, // These all get flagged for some reason
		'n/no-process-exit': 0, // These are CLI tools
	},
})

// Very temporary rules, to allow gradual reconfigure
extendedRules.push({
	files: ['scripts/*'],
	rules: {
		'n/no-process-exit': 0,
	},
})
extendedRules.push({
	files: ['**/*.ts'],
	rules: {
		// nocommit Temporary disable rules
		'n/file-extension-in-import': 0,
		'n/no-missing-import': 0,
	},
})

export default extendedRules
