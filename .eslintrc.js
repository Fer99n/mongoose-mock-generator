module.exports = {
    env: {
        node: true,
        es6: true,
        mocha: true,
        mongo: true
    },
    extends: ['airbnb-base', 'prettier', 'plugin:prettier/recommended'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020
    },
    rules: {
        'consistent-return': 'off', // requires return statement at end of arrow function
        'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
        'no-param-reassign': ['error', { props: false }],
        'func-names': 'off',
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'no-return-assign': 'off',
        'global-require': 'off'
    }
}
