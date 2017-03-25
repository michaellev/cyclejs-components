<h1 class="is-hidden-in-docs">
  Design decisions
</h1>

## Packages

Each component is to be published as a package.

A package of multiple components would have its major version bumped when any component has a breaking change.

## Zero CSS

These components offer functionality, not style. Therefore, they do not include any CSS.

It could be argued that some very basic CSS would be beneficial. Yet:

- Publishing CSS files seems out of the scope of this library.
- Inline CSS has highest priority and therefore cannot be overridden by other CSS.

Recommendation: use a CSS library. For example, this library’s documentation uses [Bulma](http://bulma.io/).
