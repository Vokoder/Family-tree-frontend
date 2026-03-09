module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "prettier",
  ],
  rules: {

  },
  settings: {
    react: {
      version: "detect",
    },
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@constants', 'src/constants'],
          ['@app', './src/app'],
          ['@components', './src/components'],
          ['@modules', 'src/modules'],
          ['@pages', './src/pages'],
          ['@routes', 'src/routes'],
          ['@layouts', 'src/layouts'],
          ['@types', 'src/types'],
          ['@store', 'src/store'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      typescript: {
        project: './tsconfig.app.json'
      }
    }
  },
};