module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			impliedStrict: true,
		},
		ecmaVersion: 6,
		sourceType: "module",
	},
	env: {
		browser: true,
		es6: true,
	},
	plugins: ["@typescript-eslint", "prettier"],
	extends: [
		"plugin:@typescript-eslint/recommended",
		"prettier/@typescript-eslint",
		"plugin:prettier/recommended",
	],
	rules: {
		"@typescript-eslint/class-name-casing": "warn",
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/semi": "warn",
		curly: "warn",
		eqeqeq: "warn",
		"no-throw-literal": "warn",
		semi: "off",
	},
};
