import fs from 'node:fs/promises'
import path from 'node:path'
import { options } from 'kolorist'
import { expect, it, vi } from 'vitest'
import { createSymlinks, type CreateSymlinksOptions } from '../src'

// Disable color, otherwise the snapshot will not match.
options.enabled = false

const cwd = 'test/__fixtures__'
const dest = 'temp/symlinks'

it('should match snapshots', async () => {
  const spy = vi.spyOn(console, 'log')

  const createSymlinksToMatchSnapshot = async (
    files: string | string[],
    options: CreateSymlinksOptions & { message?: string } = {}
  ) => {
    const { message, ...others } = options

    spy.mockClear()
    await createSymlinks(files, others)
    expect(spy.mock.calls.sort().map((item) => item.join(' '))).toMatchSnapshot(message)
  }

  await createSymlinksToMatchSnapshot('*.nginx', {
    message: 'no match',
  })

  await createSymlinksToMatchSnapshot('*', {
    clean: true,
    cwd,
    dest,
    message: 'clean',
  })

  await createSymlinksToMatchSnapshot('*', {
    cwd,
    dest,
    message: 'create',
    onConfrim: async () => true,
  })

  await createSymlinksToMatchSnapshot('*', {
    cwd,
    dest,
    message: 'skip exists',
  })

  await createSymlinksToMatchSnapshot('*', {
    cwd,
    dest: 'test',
    message: 'cancel create',
    onConfrim: async () => false,
  })

  await createSymlinksToMatchSnapshot('*', {
    clean: true,
    cwd,
    dest,
    message: 'cancel clean',
    onConfrim: async () => false,
  })

  // absolute path
  await createSymlinks('*', {
    cwd,
    dest: '/etc/nginx/sites-available',
    dry: true,
  })

  await createSymlinks(path.resolve(process.cwd(), cwd), {
    dest: '/etc/nginx/sites-enabled',
    dry: true,
  })
})

it('should created symlinks', async () => {
  const { globby } = await import('globby')
  const paths = await globby('*', { absolute: true, cwd: dest })

  for (const item of paths) {
    const link = await fs.readlink(item)

    expect(link).toBeTypeOf('string')
  }
})
