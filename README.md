# express.useif

Conditionally mount middleware.

**WARNING: This module monkey patches express.**

## Usage

```js
express()
    .use(booleanCondition, conditionalMiddleware)
    .use(someMiddleware)
```

## License

This module is published under the ISC license. See the [LICENSE](LICENSE)
file for details.
