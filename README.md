# TypeORM fixtures cli

[![CircleCI](https://circleci.com/gh/RobinCK/typeorm-fixtures.svg?style=svg)](https://circleci.com/gh/RobinCK/typeorm-fixtures)
![GitHub CI](https://github.com/RobinCK/typeorm-fixtures/workflows/Build%20CI/badge.svg?branch=master)
[![OpenCollective](https://opencollective.com/typeorm-fixtures/all/badge.svg?label=financial+contributors)](https://opencollective.com/typeorm-fixtures)
[![Coverage Status](https://coveralls.io/repos/github/RobinCK/typeorm-fixtures/badge.svg?branch=master&service=github&random=1)](https://coveralls.io/github/RobinCK/typeorm-fixtures?branch=master)
[![Version](https://img.shields.io/npm/v/typeorm-fixtures-cli.svg?style=flat-square)](https://www.npmjs.com/package/typeorm-fixtures-cli)
[![License](https://img.shields.io/npm/l/typeorm-fixtures-cli.svg?style=flat-square)](https://github.com/RobinCK/typeorm-fixtures/blob/master/LICENSE)
[![Backers on Open Collective](https://opencollective.com/typeorm-fixtures/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/typeorm-fixtures/sponsors/badge.svg)](#sponsors)

Relying on [faker.js](https://github.com/faker-js/faker), typeorm-fixtures-cli allows you to create a ton of fixtures/fake data for use while developing or testing your project. It gives you a few essential tools to make it very easy to generate complex data with constraints in a readable and easy to edit way, so that everyone on your team can tweak the fixtures if needed.

## Table of Contents

- [Install](#install)
- [Development Setup](#development-setup)
- [Example](#example)
- [Creating Fixtures](#creating-fixtures)
  - [Fixture Ranges](#fixture-ranges)
  - [Fixture Reference](#fixture-reference)
  - [Fixture Lists](#fixture-lists)
  - [Calling Methods](#calling-sync-and-async-methods)
- [Handling Relations](#handling-relations)
- [Advanced Guide](#advanced-guide)
  - [Parameters](#parameters)
  - [Faker Data](#faker-data)
  - [EJS templating](#ejs-templating)
  - [Load Processor](#load-processor)
  - [Entity Schemas](#entity-schemas)
- [Samples](#samples)
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

The current iteration can be used as a string value:

```yaml
entity: Post
items:
  post{1..10}:
    title: 'Post($current)'
    description: 'Post description'
```

`Post($current)` will return Post1 for post1, Post2 for post2 etc.

You can mutate this output by using basic math operators:

```yaml
entity: Post
items:
  post{1..10}:
    title: 'Post($current*100)'
    description: 'Post description'
```

`Post($current*100)` will return Post100 for post1, Post200 for post2 etc.

### Calling Sync and Async Methods

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
    __call:
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

This library integrates with the [faker.js](https://github.com/faker-js/faker) library. Using {{foo}} you can call Faker data providers to generate random data.

Let's turn our static bob user into a randomized entry:

```yaml
entity: User
items:
  user{1..10}:
    username: '{{internet.userName}}'
    fullname: '{{name.firstName}} {{name.lastName}}'
    birthDate: '{{date.past}}'
    email: '{{internet.email}}'
    favoriteNumber: '{{datatype.number}}'
    __call:
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

#### Alternative Javascript Syntax for CommonJS

If you need to run the fixtures under CommonJS and are having problems using typescript with the load processors, this alternative example should work for you:

`processor/UserProcessor.js`

```javascript

class UserProcessor {
  preProcess(name, obj) {
    return { ...obj, firstName: 'foo' };
  }

  postProcess(name, obj) {
    obj.name = `${obj.firstName} ${obj.lastName}`;
  }
}

module.exports = { default: UserProcessor }

```


### Entity Schemas

If you are using Entity Schemas in typeorm, you are likely to encounter problems with the `__call` feature in typeorm-fixtures due to the way the entity object is constructed. 

As a workaround, you should be able to duplicate the same method functionality in the [Load Processor](#load-processor) preProcess method (Note that the object passed in will be a plain object and not your entity object).

## Usage

```
Usage: fixtures load [options] <path> Fixtures folder/file path

Use -h or --help to show details of options: fixtures load -h
```

##### If entities files are in typescript (like [typeorm](https://typeorm.io/using-cli#if-entities-files-are-in-typescript))

This CLI tool is written in javascript and to be run on node. If your entity files are in typescript, you will need to transpile them to javascript before using CLI. You may skip this section if you only use javascript.

You may setup ts-node in your project to ease the operation as follows:

Install ts-node:

```
npm install ts-node --save-dev
```

Add typeorm command under scripts section in package.json

```
"scripts": {
    ...
    "fixtures": "fixtures-ts-node-commonjs"
}
```

For ESM projects add this instead:

```
"scripts": {
    ...
    "fixtures": "fixtures-ts-node-esm"
}
```

##### Require multiple additional modules

If you're using multiple modules at once (e.g. ts-node and tsconfig-paths)
you have the ability to require these modules with multiple require flags. For example:

```
fixtures load ./fixtures --dataSource=./dataSource.ts --sync --require=ts-node/register --require=tsconfig-paths/register
```

### Programmatically loading fixtures

Although typeorm-fixtures-cli is intended to use as a CLI, you can still load
fixtures via APIs in your program.

For example, the below code snippet will load all fixtures exist in `./fixtures` directory:

```typescript
import * as path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { createConnection, getRepository } from 'typeorm';
import { CommandUtils } from 'typeorm/commands/CommandUtils';

const loadFixtures = async (fixturesPath: string) => {
  let dataSource: DataSource | undefined = undefined;

  try {
    dataSource = await CommandUtils.loadDataSource(dataSourcePath);
    await dataSource.initialize();
    await dataSource.synchronize(true);

    const loader = new Loader();
    loader.load(path.resolve(fixturesPath));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser(), false);

    for (const fixture of fixturesIterator(fixtures)) {
      const entity: any = await builder.build(fixture);
      await dataSource.getRepository(fixture.entity).save(entity);
    }
  } catch (err) {
    throw err;
  } finally {
    if (dataSource) {
      await dataSource.destroy();
    }
  }
};

loadFixtures('./fixtures')
  .then(() => {
    console.log('Fixtures are successfully loaded.');
  })
  .catch((err) => {
    console.log(err);
  });
```

## Samples

- [typeorm-fixtures-sample](https://github.com/RobinCK/typeorm-fixtures-sample)

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/RobinCK/typeorm-fixtures/graphs/contributors"><img src="https://opencollective.com/typeorm-fixtures/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/typeorm-fixtures/contribute)]

#### Individuals

<a href="https://opencollective.com/typeorm-fixtures"><img src="https://opencollective.com/typeorm-fixtures/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/typeorm-fixtures/contribute)]

<a href="https://opencollective.com/typeorm-fixtures/organization/0/website"><img src="https://opencollective.com/typeorm-fixtures/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/typeorm-fixtures/organization/1/website"><img src="https://opencollective.com/typeorm-fixtures/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/typeorm-fixtures/organization/2/website"><img src="https://opencollective.com/typeorm-fixtures/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/typeorm-fixtures/organization/3/website"><img src="https://opencollective.com/typeorm-fixtures/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/typeorm-fixtures/organization/4/website"><img src="https://opencollective.com/typeorm-fixtures/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/typeorm-fixtures/organization/5/website"><img src="https://opencollective.com/typeorm-fixtures/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/typeorm-fixtures/organization/6/website"><img src="https://opencollective.com/typeorm-fixtures/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/typeorm-fixtures/organization/7/website"><img src="https://opencollective.com/typeorm-fixtures/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/typeorm-fixtures/organization/8/website"><img src="https://opencollective.com/typeorm-fixtures/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/typeorm-fixtures/organization/9/website"><img src="https://opencollective.com/typeorm-fixtures/organization/9/avatar.svg"></a>

MIT © [Igor Ognichenko](https://github.com/RobinCK)
