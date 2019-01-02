# typeorm-fixtures

Fixtures loader for typeorm

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
Usage: cli.ts [options] <path> Fixtures folder path

Options:
  -v, --version              output the version number
  -c, --config <path>        TypeORM config path (default: "ormconfig.yml")
  -cn, --connection [value]  TypeORM connection name (default: "default")
  --no-color                 Disable color
  -h, --help                 output usage information
```

## Configure

MIT © [Igor Ognichenko](https://github.com/RobinCK)
