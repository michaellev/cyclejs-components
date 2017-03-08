<div class="is-hidden-in-website">
  <a href="https://travis-ci.org/mightyiam/cyclejs-web-components">
    <img alt="build status" src="https://travis-ci.org/mightyiam/cyclejs-web-components.svg?branch=master"/>
  </a>
</div>

# Cycle.js web components

A set of web components for [Cycle.js](https://cycle.js.org).

<blockquote class="is-hidden-in-website">
  Read this readme in the website and enjoy the documentation:  
  https://mightyiam.github.io/cyclejs-web-components
</blockquote>

## Features

* Zero CSS
* Written in TypeScript
* Accurate, from-source-code-generated, documentation
* Demo for every property

Don’t be cynical—be cyclical.

## Development

1. `$ git clone`...
1. `$ npm install`
1. `$ npm run dev` and follow the link

### We don’t have tests, yet

https://github.com/mightyiam/cyclejs-web-components/issues/36

### Contributing a component

1. Add your component to `lib/components`.
1. The signature of a component is `(sources: Sources) => Sinks`
1. Export the component’s `Sources` and the `Sinks` interfaces.
1. Add a concise markdown description comment above each property of those.
1. The default export is the `[isolate](https://cycle.js.org/api/isolate.html)`d component.
1. Add it to the `lib/index.ts`.
1. Add one demo for each source and sink property (except `.DOM`) to `doc/demos`.
