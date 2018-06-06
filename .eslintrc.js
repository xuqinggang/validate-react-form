module.exports = {
    root: true,
    parserOptions: {
        ecmascript: 6,
        sourceType: 'module',
    },
    parser: "babel-eslint",
    env: {
        browser: true,
        node: true,
        mocha: true,
    },
    plugins: [
        "flowtype"
    ],
    extends: [
        "airbnb",
        "plugin:flowtype/recommended"
    ],
    rules: {
        indent: ["error", 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-filename-extension': ['error', { 'extensions': ['.js'] }],
        'react/prop-types': ['error', { ignore: ['dispatch'], customValidators: [] }],
        'no-param-reassign': ['warn', {
            props: true,
            ignorePropertyModificationsFor: [
                'acc', // for reduce accumulators
                'e', // for e.returnvalue
                'ctx', // for Koa routing
                'req', // for Express requests
                'request', // for Express requests
                'res', // for Express responses
                'response', // for Express responses
                '$scope', // for Angular 1 scopes
            ],
        },
        ],
        'consistent-return': 'off',

        'react/prefer-stateless-function': 'off',
        'react/jsx-indent-props': [1, 4],
        'react/no-array-index-key': 'off',
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/label-has-for': 'off',
        // Expected literal to be on the left side of ==
        'yoda': [2, 'always'],
        // disallow dangling underscores in identifiers (no-underscore-dangle)
        'no-underscore-dangle': 0,
        // Prefer destructuring from arrays and objects (prefer-destructuring)
        'prefer-destructuring': ["error", {
            "array": false,
            "object": false
        }, {
            "enforceForRenamedProperties": false,
        }],
        'no-console': 'off',
        'max-len': ["error", 120],
        // Expected an assignment or function call and instead saw an expression  
        'no-unused-expressions': [2, { allowShortCircuit: true }],
    },
};
