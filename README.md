# BDD Go to Step

## Description

A Visual Studio Code extension that provides go to step implementation on feature files for Cucumber, Behave and pytest-bdd.

## How to use

In the feature file place the cursor on the line with the step and:

* from the context menu (Right-Click) choose the option: **Go to Step Definition**
* from the command palette (Ctrl+Shift+P) execute the comamnd: **BDD: Go to Step Definition**

You can also define a keybinding to `F12` in `keybindings.json`

```
  {
    "key": "F12",
    "command": "bdd-gotostep.goToDef",
    "when": "editorTextFocus && resourceLangId == feature || editorTextFocus && resourceLangId == behave"
  }
```

## Settings

The extension has the following settings:

* `bdd-gotostep.include` : [Glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) relative to Workspace folder of the step definition files to include, (default `features/**/*.*`)
* `bdd-gotostep.exclude` : [Glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) relative to Workspace folder of the step definition files to exclude, (default `features/**/*.feature`)

They can be found in the Settings GUI under: **Extensions** > **BDD Go To Step**

You only have to change these settings if you store the `.feature` files in a different directory than `features`.

## Supported languages

Using the examples in the Cucumber and Behave documentation the following languages have step detection:

* C++
* Python
* JavaScript
* TypeScript
* Java
* Ruby
* Kotlin
* Scala
* Lua

If there is a missing language create an issue and show the typical step definition (Get/When/Then) variations (string, regular expression) with parameters (like `{name}`) and the file language extensions where it can be defined.
