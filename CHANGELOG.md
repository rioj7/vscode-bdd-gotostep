# Change Log

## [1.0.3] 2024-11-23
### Fixed
- steps detection, parse step regex to find correct closing ) of capture group
- steps detection, replace capture group or variable with a (non) capture group: `(?:.*?)`

## [1.0.1] 2024-11-20
### Added
- report error in creating Regexp from Step Description and continue searching
- honor escaped characters in Step Description
- if multiple steps match show a QuickPick with the Step Descriptions

## [1.0.0] 2024-11-19
### Fixed
- python steps detection, just search for a string in bdd decorator

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
