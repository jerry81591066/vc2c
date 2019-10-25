import { getSingleFileProgram } from './parser'
import { convertAST } from './convert'
import { InputVc2cOptions, getDefaultVc2cOptions, mergeVc2cOptions } from './options'
import { format } from './format'
import path from 'path'
import fs from 'fs'
import { readVueSFCOrTsFile } from './file'
import { setDebugMode } from './debug'
import * as BuiltInPlugins from './plugins/builtIn'

export function convert (content: string, inputOptions: InputVc2cOptions) {
  const options = mergeVc2cOptions(getDefaultVc2cOptions(inputOptions.typesciprt), inputOptions)
  const { ast, program } = getSingleFileProgram(content, options)

  return format(convertAST(ast, options, program), options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertFile (filePath: string, root: any, config: any) {
  root = (typeof root === 'string')
    ? (
      path.isAbsolute(root) ? root : path.resolve(process.cwd(), root)
    )
    : process.cwd()
  config = (typeof config === 'string') ? config : '.vc2c.js'
  const inputOptions: InputVc2cOptions = fs.existsSync(path.resolve(root, config))
    ? require(path.resolve(root, config))
    : {}
  const options = mergeVc2cOptions(getDefaultVc2cOptions(inputOptions.typesciprt), inputOptions)
  options.root = root

  if (options.debug) {
    setDebugMode(true)
  }

  const file = readVueSFCOrTsFile(filePath, options)
  return {
    file,
    result: convert(file.content, options)
  }
}

export * from './plugins/types'
export { BuiltInPlugins }
export * from './utils'
