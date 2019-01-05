# typeorm-fixtures

Fixtures loader for typeorm

## Table of Contents

- [Install](#install)
- [Example](#example)
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

## Example

```yaml
entity: Comment
parameters: {}
items:
  comment{1..10}:
    fullName: '{{name.firstName}} {{name.lastName}}'
    email: '{{internet.email}}'
    text: '{{lorem.paragraphs}}'
    post: '@post*'
```

```yaml
entity: Post
parameters: {}
items:
  post1:
    title: '{{name.title}}'
    description: '{{lorem.paragraphs}}'
    user: '@user($current)'
  post2:
    title: '{{name.title}}'
    description: '{{lorem.paragraphs}}'
    user: '@user($current)'
```

```yaml
entity: User
parameters: {}
items:
  user1:
    firstName: '{{name.firstName}}'
    lastName: '{{name.lastName}}'
    email: '{{internet.email}}'
    profile: '@profile1'
    __call:
      setPassword:
        - foo
  user2:
    firstName: '{{name.firstName}}'
    lastName: '{{name.lastName}}'
    email: '{{internet.email}}'
    profile: '@profile2'
    __call:
      setPassword:
        - foo
```

```yaml
entity: Profile
parameters: {}
items:
  profile1:
    aboutMe: <%= ['about string', 'about string 2', 'about string 3'].join(", ") %>
    skype: skype-account>
    language: english
  profile2:
    aboutMe: <%= ['about string', 'about string 2', 'about string 3'].join(", ") %>
    skype: skype-account
    language: english
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
