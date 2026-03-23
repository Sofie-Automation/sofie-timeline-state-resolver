module.exports = {
	moduleFileExtensions: ['ts', 'js'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.json',
				diagnostics: { ignoreCodes: [6133, 6192, 151002] },
			},
		],
		'^.+\\.(js)$': [
			'ts-jest',
			{
				tsconfig: { allowJs: true },
			},
		],
	},
	transformIgnorePatterns: [
		// Jest can't handle esm libraries directly
		'/node_modules/(?!(casparcg-connection|casparcg-state)/)',
		// Don't transform our other packages
		'/packages/[^/]+/dist/',
	],
	moduleNameMapper: {
		'(.+)\\.js$': '$1',
	},
	testMatch: ['**/__tests__/**/*.spec.(ts|js)'],
	testPathIgnorePatterns: ['integrationTests'],
	testEnvironment: 'node',
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	collectCoverageFrom: [
		'**/src/**/*.{ts,js}',
		'!**/node_modules/**',
		'!**/__tests__/**',
		'!**/__mocks__/**',
		'!**/src/copy/**',
		'!**/dist/**',
		'!**/src/types/**',
	],
	coverageDirectory: './coverage/',
}
