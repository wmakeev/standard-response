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
})
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
  "format": "1.0"
}
```

Lambda response in the case `standardResponse` caught an error:

```json
{
  "ok": false,
  "description": "Some error message",
  "format": "1.0"
}
```
