lambda-node-standard-response
=============================

[![npm](https://img.shields.io/npm/v/@wmakeev/lambda-node-standard-response.svg?maxAge=1800&style=flat-square)](https://www.npmjs.com/package/@wmakeev/lambda-node-standard-response)

> Standard response spec implementation for aws lambda node functions

## Installation

```
$ npm install @wmakeev/lambda-node-standard-response
```

## Usage

Example of aws lambda function code:

```js
const standardResponse = require('@wmakeev/lambda-node-standard-response')

function doStuff (ev) {
  return ev.value
}

function doStuffAsync (ev) {
  return Promise.resolve(ev.value)
}

exports.default = standardResponse(function (ev, ctx) {
  return ev.async ? doStuffAsync(ev) : doStuff(ev)
}, { debug: true })
```

`doStuff` can be sync or async (in case of async it should return `Promise`)

Lambda event:

```json
{
  "async": "true",
  "value": "Hello world!"
}
```


Lambda response (same in sync and async cases):

```json
{
  "ok": true,
  "result": "Hello world!",
  "format": "2.0"
}
```

Lambda response in the case `standardResponse` caught an error:

```json
{
  "ok": false,
  "description": "Some error message",  // equal to error.message field or 'Unknown error' (if handler returns not Error type without not empty message string field or string type error)
  "name": "Error",                      // equal to error.name
  "code": "some code",                  // equal to error.code
  "stack": ['stack trace lines'],       // specified if `options.debug` is true
  "format": "2.0"
}
```

## API

### `standardResponse(handler: function(ev, context), options: object): function(event, context, cb)`

- `handler` - sync or async (returns Promise) function
- `options.debug` - `boolean` value (if `true`, then error response will include `stack` property)

**returns:**

You `handler` wrapped in AWS Lambda standard handler style function `function(event, context, cb)`
