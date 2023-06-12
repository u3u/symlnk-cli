# `symlnk-cli`

> A CLI program for batch creating symbolic links.

[![npm version](https://badgen.net/npm/v/symlnk-cli)](https://npm.im/symlnk-cli) [![npm downloads](https://badgen.net/npm/dm/symlnk-cli)](https://npm.im/symlnk-cli) [![codecov](https://codecov.io/gh/u3u/symlnk-cli/branch/main/graph/badge.svg?token=JXgKbrQ6ez)](https://codecov.io/gh/u3u/symlnk-cli)

## Install

```sh
pnpm -g add symlnk-cli
```

## Usage

```sh
lnk *.nginx --dest /etc/nginx/sites-enabled
```

## CLI Options

```
Usage:
  $ symlnk [...files]

Commands:
  [...files]  Glob patterns for create symlinks

For more info, run any command with the `--help` flag:
  $ symlnk --help

Options:
  --dest [path]            Destination path (default: .)
  --cwd [path]             The current working directory in which to search (default: .)
  -i, --ignore [...files]  Ignore files and folders
  -f, --force              Force symlink creation
  --clean                  Clean matched symlinks
  --dry, --dry-run         Skip creating/clean symlinks (only output matching files)
  -y, --yes                Skip confirmation
  -v, --version            Display version number
  -h, --help               Display this message
```
