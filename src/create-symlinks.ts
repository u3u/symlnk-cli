import fs from 'node:fs/promises'
import path from 'node:path'
import { type Options } from 'globby'
import { blue, bold, gray, green, red, underline, yellow } from 'kolorist'
import { getSymlinkInfo } from './get-symlink-info'

export interface CreateSymlinksOptions extends Omit<Options, 'cwd'> {
  clean?: boolean
  cwd?: string
  dest?: string
  dry?: boolean
  force?: boolean
  onConfrim?(): Promise<boolean>
  yes?: boolean
}

export const createSymlinks = async (files: string | string[], options: CreateSymlinksOptions = {}) => {
  const { clean, cwd = '.', dest = '.', dry, force, ignore = [], onConfrim, yes, ...globbyOptions } = options
  const needConfirm = !yes && !dry && onConfrim
  const { globby } = await import('globby')

  const paths = await globby(files, {
    cwd,
    ignore,
    onlyFiles: false,
    ...globbyOptions,
  })

  if (!paths.length) {
    console.log(yellow('ℹ'), 'No matching files found.')

    return
  }

  if (needConfirm) {
    for (const file of paths) {
      const { link, target } = getSymlinkInfo(file, {
        cwd,
        dest,
        format: (path, type) => (type === 'source' ? underline(bold(path)) : bold(path)),
      })

      console.log(clean ? red('D') : green('M'), clean ? bold(target) : link)
    }

    if (!(await onConfrim())) {
      console.log(blue('ℹ'), 'Canceled.')

      return
    }
  }

  return Promise.allSettled(
    paths.map(async (item) => {
      const { link, source, target } = getSymlinkInfo(item, { cwd, dest })

      try {
        if (!dry) {
          if (force || clean) await fs.unlink(target).catch(() => {})

          if (!clean) {
            await fs.mkdir(path.dirname(target), { recursive: true })
            await fs.symlink(source, target)
          }
        }

        console.log(green('✔'), clean ? bold(target) : link)
      } catch {
        console.log(gray(`skip ${link}`))
      }
    })
  )
}
