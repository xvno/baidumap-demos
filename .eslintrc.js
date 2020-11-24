module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/recommended', '@vue/airbnb'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-cycle': 'off',
    'max-attribute-per-line': 'off',
    'comma-dangle': [0, 'ignore'],
    'no-plusplus': [0],
    'no-unused-vars': [0],
    'no-await-in-loop': [0],
    'no-use-before-define': [0],
    'vue/max-attributes-per-line': [0],
    'func-names': [0],
    'operator-linebreak': [0]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    BMap: 'readonly',
    BMapGL: 'readonly',
    BMapLib: 'readonly',
    BMAP_DRAWING_POLYGON: 'readonly',
    BMAP_ANCHOR_TOP_RIGHT: 'readonly'
  }
};
