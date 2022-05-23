# Change Log

## [Unreleased]
### Added

## [0.3.0] 2022-05-23
### Added
- pytest-bdd uses a `parser` to transform fields in step definitions

## [0.2.0] 2022-03-21
### Added
- Markdown with Gherkin file extension: `.feature.md`
- `@step` in Python step definition files
- Python named capture groups `(?P<name>expr)` in step definition are replaced with Javascript alternative  
  `(` and `)` are not allowed in the `expr` part.
- allow generics in the Typescript step definition: `Given<typeName>`
