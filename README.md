# Boltify

> A tool for managing projects with multiple packages based on [Bolt](http://boltpkg.com/).

[![Build Status](https://travis-ci.org/xcritical-software/boltify.svg?branch=master)](https://travis-ci.org/xcritical-software/boltify)

#### What are workspaces?

A _workspace_ is like any other node package: It's just a directory with its
own `package.json`.

Workspaces are grouped into a single "project". A _project_ is also just a
node package at the root of your repository. This is sometimes referred to
as a "monorepo", but we prefer the term "multi-package repo".

```
project
├── package.json
├── workspace-one
│   ├── package.json
│   └── index.js
└── workspace-two
    ├── package.json
    └── index.js
```

Put another way, workspaces are just like any other package, except they are
nested within a larger project/repo. Each workspace can have its own code and scripts. Workspaces can also be grouped into
sub-directories for further organization.

> **Note:** This idea is not new, other tools like [Lerna](https://lernajs.io)
> have existed for awhile and are used by many projects. Boltify is a fresh take
> on the idea.


## Commands

> **Note:** Boltify is under active development and some of these commands have
> not yet been implemented.

| Command                                 | Description                                                               | Status |
| --------------------------------------- | ------------------------------------------------------------------------- |--------|
| `boltify version`                          | **Updates the version of your package(s)**                                    |✅|
| └ `boltify version --only [name glob]`      | Filter package(s) by name                                                 |✅|
| └ `boltify version --ignore [name glob]`    | Filter out package(s) by name                                             |✅|
| └ `boltify version --only-fs [file glob]`   | Filter package(s) by file path                                            |✅|
| └ `boltify version --ignore-fs [file glob]` | Filter out package(s) by file path                                        |✅|
| └ `boltify version --no-git-tag-version` | New tag(s) will not be added and pushed                                       |✅|
| └ `boltify version --no-push` | New tag(s) will not be pushed                                        |✅|
| `boltify run [script]`                     | **Run a script in a package**                                                 |✅|
| └ `boltify run --only [name glob]`      | Filter package(s) by name                                                 |✅|
| └ `boltify run --ignore [name glob]`    | Filter out package(s) by name                                             |✅|
| └ `boltify run --only-fs [file glob]`   | Filter package(s) by file path                                            |✅|
| └ `boltify run --ignore-fs [file glob]` | Filter out package(s) by file path                                        |✅|
| └ `boltify run --since ref` | Filter package(s) that have been updated since the specified `ref`                                        |✅|
| `boltify workspaces/ws`                    | **Show package(s):**                     ||
| └ `boltify ws --only [name glob]`      | Filter package(s) by name                                                 |✅|
| └ `boltify ws --ignore [name glob]`    | Filter out package(s) by name                                             |✅|
| └ `boltify ws --only-fs [file glob]`   | Filter package(s) by file path                                            |✅|
| └ `boltify ws --ignore-fs [file glob]` | Filter out package(s) by file path                                        |✅|
| └ `boltify ws --since ref` | Filter package(s) that have been updated since the specified `ref`                                        |✅|

