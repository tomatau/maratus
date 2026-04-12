# Maratus

A React component system and installation toolchain for:

- Accessible UI primitives that you own
- Support for your codebases conventions

## Pieces

- A Golang CLI for orchestrating components and tools
- A component registry
- A collection of lib packages
- A collection of codemods

## Description

Most component libraries force a trade-off. You either consume opaque packaged components, or you copy snippets coupled to a set styling system and accessibility is outsourced.

Maratus solves that by pairing source-authored components with a CLI, registry artefacts, codemods, and manifest tooling.
Teams can install accessibility first components into their own app, keep the source local, and still preserve a structured path for upgrades and rewrites.

## Getting started

### 1. Install the CLI

Add the CLI to your app project.
This enables you to install components and run codemods

```sh
npm i -d @maratus/cli
# or
pnpm add -d @maratus/cli
# or
yarn add -d @maratus/cli
# or
bun add -d @maratus/cli
# or
deno add -d npm:@maratus-cli
```

### 2. Initialise Maratus

Creates a `maratus.json` in your project:

```sh
npm run maratus init
# or
bunx maratus init
# etc.
```

The CLI will ask you:

- If you have a `src` directory acting as a root
- Where to put components
- Where to put lib files such as the Maratus stores
- Your choice of styling system
- Your filename conventions

You can edit the resulting config file at any time.

### 3. Add a component

Install your components

```sh
bunx maratus add button
# or
bunx maratus add button separator
```

This will install:

- Components to your file naming conventions
- Integrations with your styling system
- Required lib and hook features for the component(s)
- A `maratus-theme.css` where you can wire up theming
- A `maratus-components.json` for managing component versions

### 4. Update your theme

You can edit your `maratus-theme.css` to supply values to CSS vars.
The file contains instructions for how to ensure you don't lose changes when adding more components.

## Features

- Accessible React components
- Supported styles
  - CSS modules
  - Tailwind
  - Regular CSS imports
- File-naming convention support
  - MatchExports
  - kebab-case
  - barrel files
- Configure each file type
  - Components and CSS files
  - Hooks
  - Lib
- Custom code format function
- Registry manifest
  - Golang CLI self updates
  - Golang CLI aware of new components and Codemods without updates
- Ephemeral installs
- Codemods for component and lib updates
- A custom store for accessibility features
- Requirements documentation against WCAG and W3C specs

## Contributors

Getting set up

1. Clone the repo
2. We use `proto` to manage dependencies
3. Ensure you have required tools listed in `.prototools`
4. We use `just` to run local commands
5. Install monorepo deps: `bun i`

### Commands

List available commands

```sh
just
# or
just --list
```

Run functional tests

```sh
# all tests
just test
# all component tests
just test components
# a specific component's test
just test components button
# all tests of a workspace
just test-unit codemods
just test-unit lib
```

Run unit tests

```sh
# all tests
just test
# all component tests
just test-unit components
# a specific component's test
just test-unit components button
# all unit tests of a workspace
just test-unit codemods
just test-unit lib
```

Run cli tests

```sh
just test-integration cli
```

Build the registry

```sh
just build tools build-registry
# or
just build registry
```

Build the manifest

```sh
just build packages maratus-manifest
```

Build the codemod runner

```sh
just build packages maratus-codemod-runner
```

Build the codemods

```sh
just build codemods
```

Build the cli

```sh
just cli-build
```

Generate a changeset

```sh
just changeset add
```

### Consumers

There are consumer playgrounds for local testing

An example:

```sh
# build the cli
just build codemods
just cli-build
# build the manifest
just build registry
just build packages maratus-manifest
# create a config for a consume
just cli vite-css-modules init
# try out some commands
just cli vite-css-modules add button
```
