# TypeORM fixtures cli

<p align="center">
  <a href="https://circleci.com/gh/RobinCK/typeorm-fixtures"><img src="https://circleci.com/gh/RobinCK/typeorm-fixtures.svg?style=svg"></a>
  <a href="https://coveralls.io/github/RobinCK/typeorm-fixtures?branch=master"><img src="https://coveralls.io/repos/github/RobinCK/typeorm-fixtures/badge.svg?branch=master"></a>
  <a href="https://www.npmjs.com/package/typeorm-fixtures"><img src="https://img.shields.io/npm/dm/typeorm-fixtures.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/typeorm-fixtures"><img src="https://img.shields.io/npm/v/typeorm-fixtures.svg?style=flat-square"></a>
  <a href="https://github.com/RobinCK/typeorm-fixtures/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/typeorm-fixtures.svg?style=flat-square"></a>
</p>

Relying on [faker.js](https://github.com/marak/Faker.js/), typeorm-fixtures-cli allows you to create a ton of fixtures/fake data for use while developing or testing your project. It gives you a few essential tools to make it very easy to generate complex data with constraints in a readable and easy to edit way, so that everyone on your team can tweak the fixtures if needed.

## Table of Contents

- [Install](#install)
- [Development Setup](#development-setup)
- [Example](#example)
- [Creating Fixtures](#creating-fixtures)
  - [Fixture Ranges](#fixture-ranges)
  - [Fixture Reference](#fixture-reference)
  - [Fixture Lists](#fixture-lists)
  - [Calling Methods](#calling-methods)
- [Handling Relations](#handling-relations)
- [Advanced Guide](#advanced-guide)
  - [Parameters](#parameters)
  - [Faker Data](#faker-data)
  - [EJS templating](#ejs-templating)
  - [Load Processor](#load-processor)
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

In the case of a range (e.g. user{1..10}), `($current)` will return 1 for user1, 2 for user2 etc.

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

## Handling Relations

```yaml
entity: User
items:
  user1:
    # ...

entity: Group
items:
  group1:
    name: '<{names.admin}>'
    owner: '@user1'
    members:
      - '@user2'
      - '@user3'

```

If you want to create ten users and ten groups and have each user own one group, you can use `($current)` which is replaced with the current ID of each iteration when using fixture ranges:

```yaml
entity: User
items:
  user1:
    # ...

entity: Group
items:
  group{1..10}:
    name: 'name'
    owner: '@user($current)'
    members:
      - '@user2'
      - '@user3'

```

If you would like a random user instead of a fixed one, you can define a reference with a wildcard:

```yaml
entity: User
items:
  user1:
    # ...

entity: Group
items:
  group{1..10}:
    name: 'name'
    owner: '@user*'
    members:
      - '@user2'
      - '@user3'

```

or

```yaml
entity: User
items:
  user1:
    # ...

entity: Group
items:
  group{1..10}:
    name: 'name'
    owner: '@user{1..2}' # @user1 or @user2
    members:
      - '@user2'
      - '@user3'

```

## Advanced Guide

### Parameters

You can set global parameters that will be inserted everywhere those values are used to help with readability. For example:

```yaml
entity: Group
parameters:
  names:
    admin: Admin
items:
  group1:
    name: '<{names.admin}>' # <--- set Admin
    owner: '@user1'
    members:
      - '@user2'
      - '@user3'
```

### Faker Data

This library integrates with the [faker.js](https://github.com/marak/Faker.js/) library. Using {{foo}} you can call Faker data providers to generate random data.

Let's turn our static bob user into a randomized entry:

```yaml
entity: User
items:
  user{1..10}:
    username: '{{internet.userName}}'
    fullname: '{{name.firstName}} {{name.lastName}}'
    birthDate: '{{date.past}}'
    email: '{{internet.email}}'
    favoriteNumber: '{{random.number}}'
    _call:
      setPassword:
        - foo
```

### EJS templating

This library integrates with the [EJS](https://github.com/mde/ejs)

```yaml
entity: Profile
items:
  profile1:
    aboutMe: <%= ['about string', 'about string 2', 'about string 3'].join(", ") %>
    skype: skype-account>
    language: english
```

### Load Processor

Processors allow you to process objects before and/or after they are persisted. Processors must implement the: `IProcessor`

```typescript
import { IProcessor } from 'typeorm-fixtures-cli';
```

Here is an example:

`processor/UserProcessor.ts`

```typescript
import { IProcessor } from 'typeorm-fixtures-cli';
import { User } from '../entity/User';

export default class UserProcessor implements IProcessor<User> {
  preProcess(name: string, object: any): any {
    return { ...object, firstName: 'foo' };
  }

  postProcess(name: string, object: { [key: string]: any }): void {
    object.name = `${object.firstName} ${object.lastName}`;
  }
}
```

fixture config `fixtures/user.yml`

```yaml
entity: User
processor: ../processor/UserProcessor
items:
  user1:
    firstName: '{{name.firstName}}'
    lastName: '{{name.lastName}}'
    email: '{{internet.email}}'
```

## Usage

```
Usage: fixtures [options] <path> Fixtures folder/file path

Options:
  -v, --version              output the version number
  -c, --config <path>        TypeORM config path (default: "ormconfig.yml")
  -cn, --connection [value]  TypeORM connection name (default: "default")
  -s --sync                  Database schema sync
  -d --debug                 Enable debug
  -h, --help                 output usage information
  --no-color                 Disable color
```

MIT © [Igor Ognichenko](https://github.com/RobinCK)
