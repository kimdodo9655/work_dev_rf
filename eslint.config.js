import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import * as parserVue from 'vue-eslint-parser'
import configPrettier from '@vue/eslint-config-prettier'
import * as parserTypeScript from '@typescript-eslint/parser'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...pluginVueA11y.configs['flat/recommended'],
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    plugins: {
      '@typescript-eslint': pluginTypeScript,
      'simple-import-sort': simpleImportSort
    },
    languageOptions: {
      parser: parserTypeScript,
      globals: {
        // 브라우저 환경
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        console: 'readonly',
        // ES2021
        Promise: 'readonly',
        Set: 'readonly',
        Map: 'readonly'
      }
    },
    rules: {
      ...pluginTypeScript.configs.recommended.rules
    }
  },
  {
    files: ['**/*.vue'],
    plugins: {
      '@typescript-eslint': pluginTypeScript
    },
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript
      }
    }
  },
  configPrettier,
  // Node.js 설정 파일용 (vite.config.ts 등)
  {
    files: ['vite.config.ts', 'eslint.config.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        Buffer: 'readonly'
      }
    }
  },
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      // TypeScript 규칙 완화
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unnecessary-condition': 'off',

      // Vue 규칙
      'vue/multi-word-component-names': 'off',

      // Simple Import Sort (자동 수정 완벽!)
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // 접근성 규칙
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/click-events-have-key-events': 'off',
      'vuejs-accessibility/no-static-element-interactions': 'off', // 👈 추가
      'vuejs-accessibility/label-has-for': 'off',
      'vuejs-accessibility/mouse-events-have-key-events': 'warn',
      'vuejs-accessibility/form-control-has-label': 'off'
    }
  }
]
