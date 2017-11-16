'use strict'

let test = require('blue-tape')
let standardLambdaHttpResponse = require('..')

let handler = function (ev, ctx) {
  switch (true) {
    case ev.type === 'ok' && ev.async === true:
      return Promise.resolve({ event: ev, context: ctx })

    case ev.type === 'ok' && !ev.async:
      return { event: ev, context: ctx }

    case ev.type === 'error' && ev.async === true:
      return Promise.reject(new Error('Some error'))

    case ev.type === 'error' && !ev.async:
      throw new Error('Some error')

    case ev.type === 'base64':
      return '[SOME_DATA]'
  }
}

test('standardLambdaHttpResponse', t => {
  t.equal(typeof standardLambdaHttpResponse, 'function', 'should be function')
  t.end()
})

test('standard http response success result (async)', t => {
  let lambdaHandler = standardLambdaHttpResponse(handler)
  let ev = { type: 'ok', async: true }
  let ctx = { foo: 'bar' }

  lambdaHandler(ev, ctx, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    /* eslint max-len:0 */
    t.deepEqual(data, {
      body: '{"format":"2.0","ok":true,"result":{"event":{"type":"ok","async":true},"context":{"foo":"bar"}}}',
      isBase64Encoded: false,
      statusCode: 200
    }, 'cb data argument should meet lambda http response format')
    t.end()
  })
})

test('standard http response success result (sync)', t => {
  let lambdaHandler = standardLambdaHttpResponse(handler)
  let ev = { type: 'ok', async: false }
  let ctx = { foo: 'bar' }

  lambdaHandler(ev, ctx, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    /* eslint max-len:0 */
    t.deepEqual(data, {
      body: '{"format":"2.0","ok":true,"result":{"event":{"type":"ok","async":false},"context":{"foo":"bar"}}}',
      isBase64Encoded: false,
      statusCode: 200
    }, 'cb data argument should meet lambda http response format')
    t.end()
  })
})

test('standard http response error result (async)', t => {
  let lambdaHandler = standardLambdaHttpResponse(handler)
  let ev = { type: 'error', async: true }
  let ctx = { foo: 'bar' }

  lambdaHandler(ev, ctx, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      body: '{"format":"2.0","ok":false,"description":"Some error","error_name":"Error"}',
      isBase64Encoded: false,
      statusCode: 200
    }, 'cb data argument should meet lambda http response format')
    t.end()
  })
})

test('standard http response error result (sync, debug on)', t => {
  let lambdaHandler = standardLambdaHttpResponse(handler, { debug: true })
  let ev = { type: 'error', async: false }
  let ctx = { foo: 'bar' }

  lambdaHandler(ev, ctx, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')

    let body = JSON.parse(data.body)
    t.false(body.ok)
    t.ok(body.error_stack, 'should include error stack property')
    t.ok(body.error_stack.length, 'should include error stack lines')

    t.end()
  })
})

test('standard http response success base64 result', t => {
  let lambdaHandler = standardLambdaHttpResponse(handler, {
    isBase64Encoded: true
  })
  let ev = { type: 'base64' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')

    t.deepEqual(data, {
      body: '[SOME_DATA]',
      isBase64Encoded: true,
      statusCode: 200
    })
    t.end()
  })
})

test('standard http response (success, headers)', t => {
  let lambdaHandler = standardLambdaHttpResponse(handler, {
    headers: { foo: 'bar' }
  })
  let ev = { type: 'ok' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')

    t.deepEqual(data, {
      isBase64Encoded: false,
      statusCode: 200,
      headers: { foo: 'bar' },
      body: '{"format":"2.0","ok":true,"result":{"event":{"type":"ok"},"context":null}}'
    })
    t.end()
  })
})
