import antfu from '@antfu/eslint-config'

export default antfu({
	stylistic: {
		indent: 'tab',
	},
	rules: {
		'no-mixed-spaces-and-tabs': 'off',
		'no-console': 'off',
		'node/prefer-global/process': 'off',
		'ts/ban-ts-comment': 'off',
	},
})
