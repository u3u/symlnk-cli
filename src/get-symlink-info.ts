import path from 'node:path'
import { bold } from 'kolorist'

export interface GetSymlinkInfoOptions {
  cwd?: string
  dest?: string
  format?(path: string, type: 'source' | 'target'): string
}

const relative = (to: string) => {
  if (path.isAbsolute(to)) return to

  return path.relative('.', to)
}

export const getSymlinkInfo = (file: string, options: GetSymlinkInfoOptions = {}) => {
  const { cwd = '.', dest = '.', format = bold } = options

  const source = path.isAbsolute(file)
    ? file
    : path.isAbsolute(dest)
    ? path.resolve(cwd, file)
    : path.relative(dest, path.join(cwd, file))

  const target = path.join(dest, path.basename(file))
  const link = `${format(relative(target), 'target')} -> ${format(relative(source), 'source')}`

  return {
    link,
    source,
    target,
  }
}
