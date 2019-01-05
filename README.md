# typeorm-fixtures

Fixtures loader for typeorm

## Table of Contents

- [Install](#install)
- [Example](#example)
- [Creating Fixtures](#creating-fixtures)
  - [Fixture Ranges](#fixture-ranges)
  - [Fixture Reference](#fixture-reference)
  - [Fixture Lists](#fixture-lists)
  - [Calling Methods](#calling-methods)
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

`fixtures/Comment.yml`

```yaml
entity: Comment
items:
  comment{1..10}:
    fullName: '{{name.firstName}} {{name.lastName}}'
    email: '{{internet.email}}'
    text: '{{lorem.paragraphs}}'
    post: '@post*'
```

`fixtures/Post.yml`

```yaml
entity: Post
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

`fixtures/User.yml`

```yaml
entity: User
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

`fixtures/Profile.yml`

```yaml
entity: Profile
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

## Creating Fixtures

The most basic functionality of this library is to turn flat yaml files into objects

```yaml
entity: User
items:
  user0:
    username: bob
    fullname: Bob
    birthDate: 1980-10-10
    email: bob@example.org
    favoriteNumber: 42

  user1:
    username: alice
    fullname: Alice
    birthDate: 1978-07-12
    email: alice@example.org
    favoriteNumber: 27
```

### Fixture Ranges

The first step is to let create many copies of an object for you to remove duplication from the yaml file.

You can do that by defining a range in the fixture name:

```yaml
entity: User
items:
  user{1..10}:
    username: bob
    fullname: Bob
    birthDate: 1980-10-10
    email: bob@example.org
    favoriteNumber: 42
```

Now it will generate ten users, with IDs user1 to user10. Pretty good but we only have 10 bobs with the same name, username and email, which is not so fancy yet.

### Fixture Reference

You can also specify a reference to a previously created list of fixtures:

```yaml
entity: Post
items:
  post1:
    title: 'Post title'
    description: 'Post description'
    user: '@user1'
```

### Fixture Lists

You can also specify a list of values instead of a range:

```yaml
entity: Post
items:
  post{1..10}:
    title: 'Post title'
    description: 'Post description'
    user: '@user($current)'
```

In the case of a range (e.g. user{1..10}), <current()> will return 1 for user1, 2 for user2 etc.

### Calling Methods

Sometimes though you need to call a method to initialize some more data, you can do this just like with properties but instead using the method name and giving it an array of arguments.

```yaml
entity: User
items:
  user{1..10}:
    username: bob
    fullname: Bob
    birthDate: 1980-10-10
    email: bob@example.org
    favoriteNumber: 42
    _call:
      setPassword:
        - foo
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
