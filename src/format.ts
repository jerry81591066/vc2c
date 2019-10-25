import { Vc2cOptions } from './options'
import path from 'path'
import fs from 'fs'
import prettierFormat from 'prettier-eslint'
import { log } from './debug'

export function format (content: string, options: Vc2cOptions) {
  const eslintConfigPath = path.resolve(options.root, options.eslintConfigFile)
  const prettierEslintOpions = (fs.existsSync(eslintConfigPath))
    ? {
      text: content,
      filePath: eslintConfigPath,
      prettierOptions: {
        parser: 'typescript'
      },
      fallbackPrettierOptions: {
        parser: 'typescript'
      }
    }
    : {
      text: content,
      filePath: '',
      eslintConfig: {
        parser: require.resolve('@typescript-eslint/parser'),
        parserOptions: {
          sourceType: 'module',
          ecmaFeatures: {
            jsx: false
          }
        },
        rules: {
          semi: ['error', 'never'],
          'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: '*', next: 'export' },
            { blankLine: 'always', prev: 'const', next: 'const' },
            { blankLine: 'always', prev: 'const', next: 'return' }
          ]
        }
      },
      prettierOptions: {
        parser: 'typescript',
        Semicolons: false,
        singleQuote: true
      },
      fallbackPrettierOptions: {
        parser: 'typescript',
        singleQuote: true,
        Semicolons: false
      }
    }

  log('Format result code.....')
  return prettierFormat(prettierEslintOpions)
}
