<h1 class="is-hidden-in-docs">
  Contributing
</h1>

## Getting started

1. `$ git clone`...
1. `$ npm install`
1. `$ npm run dev` and follow the link

## We don’t have tests, yet

https://github.com/mightyiam/cyclejs-components/issues/36

## Contributing a component

### What is a valuable component?

This is an attempt to define what counts as a component that has actual value to users and therefore should be eligible for this project in this regard.

- The component in mind is a kind of component that the modern browser does not easily provide.
  Because if it does, then such a component would be merely a different, perhaps *slightly* better API for that.

### Technical guidelines

1. See existing components for tangible examples.
1. Add your component to a directory under `lib`. For example, `lib/thingamading`
1. The component may consist of multiple modules, yet, the main export must be `index.ts`.
1. Each component must export its `Sources` and `Sinks` interfaces as those names.
1. Each source and sink of the component, except common sources and sinks, must be documented. This is done using a single comment above each source/sink type definition.
1. Each component must be isolated [using `isolate`](https://cycle.js.org/api/isolate.html).
1. In the component’s directory must be a `component.package.json` file. It must have the property `version` initially at `0.0.0` and it may have `dependencies`. No other properties.
1. Please consider contributing demos for your component, as well.

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
