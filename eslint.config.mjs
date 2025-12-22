import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'

export default [
  {
    ignores: ['**/node_modules/', '**/dist/', '**/build/', '**/playwright-report']
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@stylistic': stylistic,
      react: reactPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },

    rules: {
      // React Rules
      ...reactPlugin.configs.recommended.rules,
      'react/jsx-uses-vars': 'error', // Fixes the "Component defined but never used" error
      'react/react-in-jsx-scope': 'off',

      // Stylistic Rules
      '@stylistic/indent': ['error', 2],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],

      // General Rules
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',

      // Turn off unused vars
      'no-unused-vars': 'warn',

      // Optional: Turns off prop-types
      'react/prop-types': 'off'
    }
  }
]