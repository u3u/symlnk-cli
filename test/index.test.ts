import path from 'node:path'
import { expect, it, vi } from 'vitest'
import { createSymlinks, type CreateSymlinksOptions } from '../src/create-symlinks'

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
    expect(spy.mock.calls.sort()).toMatchSnapshot(message)
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
