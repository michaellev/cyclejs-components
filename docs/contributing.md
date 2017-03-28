<h1 class="is-hidden-in-docs">
  Contributing
</h1>

## Getting started

1. `$ git clone`...
1. `$ npm install`
1. `$ npm run dev` and follow the link

## Code style

No worries―code style is enforced via the `npm test` script. For your information:

- TypeScript files are linted with `tslint`, using [tslint-config-standard](https://www.npmjs.com/package/tslint-config-standard).
- JavaScript files are linted with [standard](https://standardjs.com/).

## npm scripts you should know about

- `purge-components-node_modules` removes all `node_modules` in component directories.
- `npm-install-for-components` runs `npm install` inside each component directory.
- `dev` runs a development server that serves the documentation.
- `test`

All the rest are self-explanatory. Run `npm run` or see the `package.json`.

## Pre-commit hook

Using the [pre-commit](https://www.npmjs.com/package/pre-commit) package, a pre-commit hook is automatically set up.

## Contributing a component

### What is a valuable component?

This is an attempt to define what counts as a component that has actual value to users and therefore should be eligible for this project in this regard.

- The component in mind is a kind of component that the modern browser does not easily provide.
  Because if it does, then such a component would be merely a different, perhaps *slightly* better API for that.

### Technical guidelines

*Non less the attempt at thorough documentation, perhaps the most important advice to keep in mind is to see the existing components for tangible examples of everything documented here*.

1. Add your component to a directory under `lib`. For example, `lib/thingamading`
1. The component may consist of multiple modules, yet, the main export must be `index.ts`. See section on it.
1. Run the `update-componenent-package-jsons` npm script without arguments to generate an initial `package.json`. See a section on this.
1. Each component must have a demo. See section on demos.

#### The component’s `index.ts`

1. It must export the component’s `Sources` and `Sinks` interfaces as these names.
1. Each source and sink of the component must be documented. This is done using a single comment above each source/sink type definition. *Common properties* have constant documentation. If provided, documentation for *common properties* will be *appended* to the constant documentation. The common properties are `DOM` source, `DOM` sink, `HTTP` source and `HTTP` sink.
1. Each component must be isolated [using `isolate`](https://cycle.js.org/api/isolate.html).

#### Tests

We’re using the [AVA](https://github.com/avajs/ava) test runner.

Every component should have thorough tests.

Test files are located and named after the files they test, with a `.test` suffix. For example:

- `lib/foo-thing/index.ts`
- `lib/foo-thing/index.test.ts`

####  Component `package.json`s

Each component has a `package.json` file in its directory. Most fields are managed automatically by the npm script `update-component-package-jsons`. The following fields are managed manually:

- `title`: the English title of the component.
- `dependencies` is normally managed (e.g. `npm install --save [dependency]`).
- `version` should be incremented during publishing. See section on publishing.
- `keywords`: manually added keywords will be preserved.

For more information see the `update-component-package-jsons` npm script.

#### A demo for the component

Each component must have a demo component. It must clearly demonstrate all of the component’s features. It must be the default export of a `demo.ts` file in the component’s directory. It will be automatically displayed in the component’s documentation page.

## Publishing a component package

*This requires ability to push to `master` and push tags*.

So, you’ve made some changes in a component and would like to publish them.

Assuming those changes are in the `master` branch by now...

To increment this component’s version:

```
$ npm run increment-component-version [comopnent] [magnitude]
```

where `component` is the name of the component’s directory and `magnitude` is one of `major`, `minor` and `patch`.

Now run:

```
$ npm run before-publish-component
$ cd lib/[component]
$ npm publish
```

If this is the first time this package is being published, it might require `npm publish --access=public`.
