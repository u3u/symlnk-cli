#!/usr/bin/env node
import { cac } from 'cac'
import { blue } from 'kolorist'
import prompts from 'prompts'
import { name, version } from '../package.json'
import { createSymlinks } from './create-symlinks'

const cli = cac(name)

cli.version(version)

cli
  .command('[...files]', 'Glob patterns for create symlinks')
  .option('--dest [path]', 'Destination path', { default: '.' })
  .option('--cwd [path]', 'The current working directory in which to search', { default: '.' })
  .option('-i, --ignore [...files]', 'Ignore files and folders')
  .option('-f, --force', 'Force symlink creation')
  .option('--clean', 'Clean matched symlinks')
  .option('--dry, --dry-run', 'Skip creating/clean symlinks (only output matching files)')
  .option('-y, --yes', 'Skip confirmation')
  .action(async (files, options) => {
    const { clean, cwd, dest, dry, force, ignore, yes } = options

    const result = await createSymlinks(files, {
      clean,
      cwd,
      dest,
      dry,
      force,
      ignore,

      onConfrim: async () => {
        const result = await prompts({
          initial: true,
          message: `Are you sure you want to ${clean ? 'clean' : 'create'} these symlinks?`,
          name: 'value',
          type: 'confirm',
        })

        return result.value
      },

      yes,
    })

    if (!result) return

    if (dry) console.log(blue('ℹ'), 'Dry run, no changes will be made to symlinks.')
    else console.log('✨', `${clean ? 'Clean' : 'Create'} symlinks done.`)
  })

cli.help()

cli.parse()
