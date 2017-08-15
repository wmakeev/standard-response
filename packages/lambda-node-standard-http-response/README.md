lambda-node-standard-http-response
==================================

[![npm](https://img.shields.io/npm/v/@wmakeev/lambda-node-standard-http-response.svg?maxAge=1800&style=flat-square)](https://www.npmjs.com/package/@wmakeev/lambda-node-standard-http-response)

> Standard response spec implementation for aws lambda http handler function

## Installation

```
$ npm install @wmakeev/lambda-node-standard-http-response
```

## Usage

Example of aws lambda function code:

```js
const standardHttpResponse = require('@wmakeev/lambda-node-standard-http-response')

function doStuff (ev) {
  return ev.value
}

function doStuffAsync (ev) {
  return Promise.resolve(ev.value)
}

exports.default = standardHttpResponse(function (ev, ctx) {
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
  "body": "{\"format\":\"1.1\",\"ok\":true,\"result\":\"Hello world!\"}",
  "isBase64Encoded": false,
  "statusCode": 200
}
```

See more about `body` format in [lambda-node-standard-response](https://github.com/wmakeev/standard-response/tree/master/packages/lambda-node-standard-response) module descripton

## API

### `standardHttpResponse(handler: function(ev, context), options: object): function(event, context, cb)`

- `handler` - sync or async (returns Promise) function
- `options.debug: boolean` - if `true`, then `debug` option will pass to wrapped[lambda-node-standard-response](https://github.com/wmakeev/standard-response/tree/master/packages/lambda-node-standard-response) handler
- `options.isBase64Encoded: boolean` - if `true`, then `body` content shoud equal to standard response `result` field

**returns:**

You `handler` wrapped in AWS Lambda standard handler style function `function(event, context, cb)`
