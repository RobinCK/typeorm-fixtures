# typeorm-fixtures

Fixtures loader for typeorm

## Table of Contents

- [install](#install)
- [Usage](#usage)

## Install

#### NPM

```bash
npm install typeorm-fixtures-cli --save-dev
```

#### Yarn

```bash
yarn add typeorm-fixtures-cli --dev
```

## Development Setup

```bash
# install dependencies
npm install

# build dist files
npm run build
```

## Usage

```
Usage: fixtures [options] <path> Fixtures folder path

Options:
  -v, --version              output the version number
  -c, --config <path>        TypeORM config path (default: "ormconfig.yml")
  -cn, --connection [value]  TypeORM connection name (default: "default")
  -s --sync                  Database schema sync
  -d --debug                 Enable debug
  -h, --help                 output usage information
  --no-color                 Disable color
```

## Configure

MIT © [Igor Ognichenko](https://github.com/RobinCK)
