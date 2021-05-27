module.exports = {
	moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'ts', 'tsx', 'csv'],

	transform: {
		'^.+\\.vue$': 'vue-jest',
		'.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
			'jest-transform-stub',
		'^.+\\.tsx?$': 'ts-jest',
	},

	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},

	snapshotSerializers: ['jest-serializer-vue'],

	testMatch: [
		'**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
	],

	testURL: 'http://localhost/',

	globals: {
		'ts-jest': {
			babelConfig: true,
		},
	},

	preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
}
