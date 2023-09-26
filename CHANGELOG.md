# [4.0.0](https://github.com/RobinCK/typeorm-fixtures/compare/3.0.1...4.0.0) (2023-09-26)

### Bug Fixes

- glob path separator must use '/' on Windows ([#203](https://github.com/RobinCK/typeorm-fixtures/issues/203)) ([c68a692](https://github.com/RobinCK/typeorm-fixtures/commit/c68a6927826a5172e167035c3ecaa4555fe28913))
- use graphs instead ([098f4e4](https://github.com/RobinCK/typeorm-fixtures/commit/098f4e4b08599e6ca7a75fa70b562ae07cefd8fe))

## [3.0.1](https://github.com/RobinCK/typeorm-fixtures/compare/3.0.0...3.0.1) (2022-08-18)

### Bug Fixes

- amend deprecated faker method ([f0f41c4](https://github.com/RobinCK/typeorm-fixtures/commit/f0f41c4892cf4d01cadf6a6d3d613161c5ee7b12))

# [3.0.0](https://github.com/RobinCK/typeorm-fixtures/compare/2.0.0...3.0.0) (2022-07-02)

### Bug Fixes

- **chalk:** revert to chalk version 4 ([6347787](https://github.com/RobinCK/typeorm-fixtures/commit/63477870105e4f1e65ff189cd1ad56a82b35621f))
- **cli:** add cli to have esm and cjs mode like typeorm cli ([aec7d09](https://github.com/RobinCK/typeorm-fixtures/commit/aec7d09b500e99f3d7e11e1c9c36c4ca315c4f52))
- **cli:** fix yargs arguments ([c328299](https://github.com/RobinCK/typeorm-fixtures/commit/c3282990ff2d124e22883842d5de0783d0c598ce))
- fix call function ([5f2f31b](https://github.com/RobinCK/typeorm-fixtures/commit/5f2f31bb7da92eb1059dd0ae9ca92de92fde0727))
- **fix:** fix call function ([c6f1e9c](https://github.com/RobinCK/typeorm-fixtures/commit/c6f1e9cee42c8b6e8a983f33f8b5d97be9a4f2c8))
- **lint:** fix configuration of eslint ([3fce893](https://github.com/RobinCK/typeorm-fixtures/commit/3fce8938558ed5d77bd5ee90a0315f28b48ad7c0))
- **test:** provide new argument ignoreDecorators ([aa3c261](https://github.com/RobinCK/typeorm-fixtures/commit/aa3c261307de518fb18ef05673d499fb7af7ff0c))

### Code Refactoring

- **all:** update outdated packages, use yargs ([e523d55](https://github.com/RobinCK/typeorm-fixtures/commit/e523d5585f778f815745a17ceceb976172de324a))

### Features

- **datasource:** use new method to load dataSource ([78559af](https://github.com/RobinCK/typeorm-fixtures/commit/78559af178f9bbd55e577b95dcc5170c3f508bce))

### BREAKING CHANGES

- **all:** use new fakerjs package, some random functions was removed
- **datasource:** ormconfig file should not work anymore, use dataSource file instead.

# [2.0.0](https://github.com/RobinCK/typeorm-fixtures/compare/1.11.1...2.0.0) (2022-06-17)

### Bug Fixes

- **ci:** update github actions configuration to use last images ([8a1c340](https://github.com/RobinCK/typeorm-fixtures/commit/8a1c340683ba7c9e9f0cb7caf63b52bad00a7cb6))
- update packages to have a compatibility with typeorm 0.3.\* ([c4ee8f7](https://github.com/RobinCK/typeorm-fixtures/commit/c4ee8f7e7b607eb9aed2c48a3a4c274ef5318a21)), closes [#189](https://github.com/RobinCK/typeorm-fixtures/issues/189)

### BREAKING CHANGES

- Imcompatible with typeorm 0.2.0, this version uses the new datasource class of
  typeorm 0.3.0.

## [1.11.1](https://github.com/RobinCK/typeorm-fixtures/compare/1.11.0...1.11.1) (2022-03-29)

### Bug Fixes

- circleci ([28beb04](https://github.com/RobinCK/typeorm-fixtures/commit/28beb04511e385ff888d5b6fc20ecb2b9f0362e4))

# [1.11.0](https://github.com/RobinCK/typeorm-fixtures/compare/1.10.1...1.11.0) (2022-03-20)

## [1.10.1](https://github.com/RobinCK/typeorm-fixtures/compare/1.10.0...1.10.1) (2022-01-15)

# [1.10.0](https://github.com/RobinCK/typeorm-fixtures/compare/1.9.1...1.10.0) (2022-01-15)

### Features

- support parsing `null` values as `null` ([b5db29b](https://github.com/RobinCK/typeorm-fixtures/commit/b5db29b0a605ea1638a7c796be9030cc8d7adb6e))

## [1.9.1](https://github.com/RobinCK/typeorm-fixtures/compare/1.9.0...1.9.1) (2021-01-17)

### Bug Fixes

- Recognize EJS over multiple lines ([b3f6043](https://github.com/RobinCK/typeorm-fixtures/commit/b3f6043612dc96542e73603965568b0a5806cec3))
- update postinstall script ([3cdc24f](https://github.com/RobinCK/typeorm-fixtures/commit/3cdc24fa101ff2c0c6045e1a51a34cc6704a200f)), closes [#147](https://github.com/RobinCK/typeorm-fixtures/issues/147)

# [1.9.0](https://github.com/RobinCK/typeorm-fixtures/compare/1.8.1...1.9.0) (2020-12-25)

### Bug Fixes

- removed ignore flag for class transformer decorators ([f500747](https://github.com/RobinCK/typeorm-fixtures/commit/f500747c830a15be47cd57f93c75f03945c8feea))

## [1.8.1](https://github.com/RobinCK/typeorm-fixtures/compare/1.8.0...1.8.1) (2020-11-11)

# [1.8.0](https://github.com/RobinCK/typeorm-fixtures/compare/1.6.0...1.8.0) (2020-09-16)

### Bug Fixes

- large datasets times scaling exponential ([06a0235](https://github.com/RobinCK/typeorm-fixtures/commit/06a0235a55e22b7b7f9e54c3c36c350cb0dfe757))
- table names with underscores cannot be loaded ([7aadf55](https://github.com/RobinCK/typeorm-fixtures/commit/7aadf5592358e18dd9482ae5bc7fb4e546dd28d0))

### Features

- added faker locale support ([2385ab9](https://github.com/RobinCK/typeorm-fixtures/commit/2385ab9d5c3091242b7cc7bac18ec8f2078a2f37))

# [1.6.0](https://github.com/RobinCK/typeorm-fixtures/compare/1.3.6...1.6.0) (2020-05-23)

### Bug Fixes

- check if entity method ([191dd0f](https://github.com/RobinCK/typeorm-fixtures/commit/191dd0f120ebbb07cd39109e974cc4a01c828456))
- **package:** update cli-progress to version 3.0.0 ([8cf6ff8](https://github.com/RobinCK/typeorm-fixtures/commit/8cf6ff8b10fdcf5304561afc279d14cf00c8a6d1))
- **package:** update commander to version 3.0.0 ([978d4c0](https://github.com/RobinCK/typeorm-fixtures/commit/978d4c0ee0a66ec17e213e40e6052ee28306d87c))
- **package:** update yargs-parser to version 14.0.0 ([ce4f273](https://github.com/RobinCK/typeorm-fixtures/commit/ce4f273cc878a06204bea0ed22565e8cd4f81298))
- **package:** update yargs-parser to version 15.0.0 ([cba52a0](https://github.com/RobinCK/typeorm-fixtures/commit/cba52a0e2eb44dd9b7958064f528486395f92dca))

### Features

- parses parameters from process.env ([53e6f64](https://github.com/RobinCK/typeorm-fixtures/commit/53e6f64f1cee8f37acf338c708cb0f5bd0519336))

## [1.3.6](https://github.com/RobinCK/typeorm-fixtures/compare/1.1.5...1.3.6) (2019-08-16)

### Bug Fixes

- build ([25be751](https://github.com/RobinCK/typeorm-fixtures/commit/25be7514b1c01297273f10355b93c16383dfb861))
- index as $ ([8655ed4](https://github.com/RobinCK/typeorm-fixtures/commit/8655ed4b601f960b03631db9b12b2a4848e8f099))
- restore tslint format ([2313139](https://github.com/RobinCK/typeorm-fixtures/commit/23131394c73fe47c481e60f5d54b11de902f9906))
- restore tslint format ([e53e330](https://github.com/RobinCK/typeorm-fixtures/commit/e53e33061b4592e68b2e34469279d7408bf49766))
- **transformer:** ignored @Expose and @Exclude ([3aa272c](https://github.com/RobinCK/typeorm-fixtures/commit/3aa272c9c771b7569ff08c16a576edade75567f5))
- tslint empty line ([a22e3d4](https://github.com/RobinCK/typeorm-fixtures/commit/a22e3d45bd80a71acb989c19ebf6503a7721f560))
- updated readme & unit tests ([62a2faa](https://github.com/RobinCK/typeorm-fixtures/commit/62a2faaad8f8fe31148ad76fae07142991974ebe))

### Features

- add calculations to current ([370cf46](https://github.com/RobinCK/typeorm-fixtures/commit/370cf464f58e81630d8240d1ebb8d01554a94944))
- added support "export default" for ormconfig ([0712ffc](https://github.com/RobinCK/typeorm-fixtures/commit/0712ffcdb29e770f879ab070b00afba515253a30))
- **builder:** added class-transformer support ([32b242c](https://github.com/RobinCK/typeorm-fixtures/commit/32b242c164aebd98cb72390999d1f8c5359305ee))
- current resolved as string ([97fab7b](https://github.com/RobinCK/typeorm-fixtures/commit/97fab7b28a3f95d0a24531da7b6908d98ba44847))

### Reverts

- Revert "chore(release): 1.3.3 :tada:" ([451fcdf](https://github.com/RobinCK/typeorm-fixtures/commit/451fcdf85d27ce4d6da108ea07451e74244484d7))

## [1.1.5](https://github.com/RobinCK/typeorm-fixtures/compare/1.1.1...1.1.5) (2019-06-02)

### Bug Fixes

- getting repository from established connection rather than default ([868528a](https://github.com/RobinCK/typeorm-fixtures/commit/868528af1b46031b96b9c7c1d02d0507a7a2dda2))
- **package:** update resolve-from to version 5.0.0 ([6197630](https://github.com/RobinCK/typeorm-fixtures/commit/619763028f9398173facf31d1dd6e6781c461b37))
- update execute logic for \_\_call ([f105e52](https://github.com/RobinCK/typeorm-fixtures/commit/f105e526b9c48629396871cf2da6c18a91c4170f))

## [1.1.1](https://github.com/RobinCK/typeorm-fixtures/compare/1.1.0...1.1.1) (2019-01-30)

### Bug Fixes

- **processors:** fixed unecessary usage of promise.resolve ([1a56360](https://github.com/RobinCK/typeorm-fixtures/commit/1a563609cf1431429acd7049694d2f9dc4c70716))

### Features

- **processors:** use async processors ([a2db3a5](https://github.com/RobinCK/typeorm-fixtures/commit/a2db3a5098b6f0b13358968fdfcc41d5adde6cb7))

# [1.1.0](https://github.com/RobinCK/typeorm-fixtures/compare/1.0.0...1.1.0) (2019-01-20)

### Features

- allow multiple paths in cli arguments ([f672390](https://github.com/RobinCK/typeorm-fixtures/commit/f672390b787d4de41520d2cee121cf85374fa6da))

# [1.0.0](https://github.com/RobinCK/typeorm-fixtures/compare/0.3.6...1.0.0) (2019-01-14)

### Bug Fixes

- **resolver:** null peroperty ([54437b8](https://github.com/RobinCK/typeorm-fixtures/commit/54437b800f19c581b031ac603a5a0284a16ff132))

### Features

- **cli:** added require options ([430e02c](https://github.com/RobinCK/typeorm-fixtures/commit/430e02caa7e09a3f3e42e3bcd25f6558c960822c))

## [0.3.6](https://github.com/RobinCK/typeorm-fixtures/compare/0.3.5...0.3.6) (2019-01-11)

## [0.3.5](https://github.com/RobinCK/typeorm-fixtures/compare/0.3.4...0.3.5) (2019-01-10)

### Bug Fixes

- **builder:** call methods ([ca05906](https://github.com/RobinCK/typeorm-fixtures/commit/ca05906a6bbe1cfcd0420f736b2b41effac679bf))

## [0.3.4](https://github.com/RobinCK/typeorm-fixtures/compare/0.3.3...0.3.4) (2019-01-10)

### Bug Fixes

- **parser:** create getters for regexp ([e3daccf](https://github.com/RobinCK/typeorm-fixtures/commit/e3daccf6465353202830e6de9f02480ab881fc4f))
- **resolver:** resolve for nullable property ([ce97ba3](https://github.com/RobinCK/typeorm-fixtures/commit/ce97ba3ca79c8e51ce52bb30c8c48282690cf009))

## [0.3.3](https://github.com/RobinCK/typeorm-fixtures/compare/0.2.4...0.3.3) (2019-01-10)

### Bug Fixes

- **cli:** progress bar length ([4825f3f](https://github.com/RobinCK/typeorm-fixtures/commit/4825f3f22bf9eaefffde16a994bd10edb2c110dc))
- **resolver:** resolve dependencies if used $current ([47bd691](https://github.com/RobinCK/typeorm-fixtures/commit/47bd6914110f3a5f011761961fdc07920460be60))

### Features

- **parser:** add support booalen and number for faker ([7d894b5](https://github.com/RobinCK/typeorm-fixtures/commit/7d894b563855e3e371c87062c0ef63dd6042dfb0))

## [0.2.4](https://github.com/RobinCK/typeorm-fixtures/compare/0.2.3...0.2.4) (2019-01-07)

### Bug Fixes

- loader test ([a3f5c3c](https://github.com/RobinCK/typeorm-fixtures/commit/a3f5c3cbdcf4c2f2674164487429013f00697444))

## [0.2.3](https://github.com/RobinCK/typeorm-fixtures/compare/0.2.2...0.2.3) (2019-01-07)

### Bug Fixes

- **processor:** relevant path ([c4ed99e](https://github.com/RobinCK/typeorm-fixtures/commit/c4ed99ec6c2ce778317de13c3a3ddf2b03b6a1c7))
- **test:** integration assets ([d287e4d](https://github.com/RobinCK/typeorm-fixtures/commit/d287e4d0a1a33eff99de499f953b6761f71b77b0))

### Features

- **loader:** load fixtures from file ([9287180](https://github.com/RobinCK/typeorm-fixtures/commit/928718051d710ac7410b06de0b6761ee505446ec))

## [0.2.2](https://github.com/RobinCK/typeorm-fixtures/compare/0.2.1...0.2.2) (2019-01-07)

### Bug Fixes

- loader ([422a55c](https://github.com/RobinCK/typeorm-fixtures/commit/422a55c835db3918782cff06eb80208cd4094a08))

## [0.2.1](https://github.com/RobinCK/typeorm-fixtures/compare/0.2.0...0.2.1) (2019-01-05)

### Features

- add json loader ([6bed4a1](https://github.com/RobinCK/typeorm-fixtures/commit/6bed4a1ca8b8ff22ac62f1efb7e70806e9fac695))

# [0.2.0](https://github.com/RobinCK/typeorm-fixtures/compare/eca2cb81d976c29978e9ea93fd5ffbfaf6f2ee1e...0.2.0) (2019-01-03)

### Bug Fixes

- 🐛 current reference ([2ce285a](https://github.com/RobinCK/typeorm-fixtures/commit/2ce285aeb7f2a3fce966e71fd747631ac02da514))
- 🐛 processor functionality ([fa8f6de](https://github.com/RobinCK/typeorm-fixtures/commit/fa8f6de2673d8e83a0cffb755bf80801748ca9b9))
- package.json ([d2a7eb4](https://github.com/RobinCK/typeorm-fixtures/commit/d2a7eb429cefc135e31eacf56ee63b523e35ca77))
- test entities ([3347bea](https://github.com/RobinCK/typeorm-fixtures/commit/3347bea46165116c666d1dfc53926d4311a1d048))

### Features

- 🎸 implement range reference ([07fef4b](https://github.com/RobinCK/typeorm-fixtures/commit/07fef4b0c053e734df040b8e08b2dd1b65c02435))
- add debug and sync options ([d196f0f](https://github.com/RobinCK/typeorm-fixtures/commit/d196f0f4152fe2daac9c85e25ea47b6b9e9941e1))
- configure commitlint ([eca2cb8](https://github.com/RobinCK/typeorm-fixtures/commit/eca2cb81d976c29978e9ea93fd5ffbfaf6f2ee1e))
- output process ([bf5b9ed](https://github.com/RobinCK/typeorm-fixtures/commit/bf5b9ed40aa773edbedb145408c9a32851446dc4))
