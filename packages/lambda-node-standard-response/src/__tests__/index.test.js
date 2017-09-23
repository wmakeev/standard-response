'use strict'

let test = require('blue-tape')
let standardLambdaResponse = require('..')

let FORMAT = '1.2'

let funcSync = function (ev, ctx) {
  switch (ev.type) {
    case 'ok':
      return { event: ev, context: ctx }

    case 'error':
      throw new Error('Some error')

    case 'error-code':
      let errorWithCode = new Error('Some error with code')
      errorWithCode.code = 404
      throw errorWithCode

    case 'error-name':
      let errorWithName = new Error('Some error with name')
      errorWithName.name = 'SomeNamedError'
      throw errorWithName

    case 'error-text':
      /* eslint prefer-promise-reject-errors:0, no-throw-literal:0 */
      throw 'Some text error'
  }
}

let funcAsync = function (ev, ctx) {
  return new Promise((resolve, reject) => {
    switch (ev.type) {
      case 'ok':
        return resolve({ event: ev, context: ctx })

      case 'error':
        return reject(new Error('Some error'))

      case 'error-code':
        let errorWithCode = new Error('Some error with code')
        errorWithCode.code = 404
        return reject(errorWithCode)

      case 'error-text':
        /* eslint prefer-promise-reject-errors:0 */
        return reject('Some text error')

      case 'error-obj':
        /* eslint prefer-promise-reject-errors:0 */
        return reject({ message: 'Some error object', error: true })

      case 'error-obj2':
        /* eslint prefer-promise-reject-errors:0 */
        return reject({ message: {}, error: true })

      case 'throw':
        throw new Error('Some error thrown')
    }
  })
}

test('standardLambdaResponse', t => {
  t.equal(typeof standardLambdaResponse, 'function', 'should be function')
  t.end()
})

test('standard response success result (sync)', t => {
  let lambdaHandler = standardLambdaResponse(funcSync)
  let ev = { type: 'ok' }
  let ctx = { foo: 'bar' }

  lambdaHandler(ev, ctx, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: true,
      result: { event: ev, context: ctx },
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response success result (async)', t => {
  let lambdaHandler = standardLambdaResponse(funcAsync)
  let ev = { type: 'ok' }
  let ctx = { foo: 'bar' }

  lambdaHandler(ev, ctx, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: true,
      result: { event: ev, context: ctx },
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch error (sync)', t => {
  let lambdaHandler = standardLambdaResponse(funcSync)
  let ev = { type: 'error' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'Error',
      description: 'Some error',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch error (async)', t => {
  let lambdaHandler = standardLambdaResponse(funcAsync)
  let ev = { type: 'error' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'Error',
      description: 'Some error',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch error with code (sync)', t => {
  let lambdaHandler = standardLambdaResponse(funcSync)
  let ev = { type: 'error-code' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'Error',
      error_code: 404,
      description: 'Some error with code',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch error with code (async)', t => {
  let lambdaHandler = standardLambdaResponse(funcAsync)
  let ev = { type: 'error-code' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'Error',
      error_code: 404,
      description: 'Some error with code',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch error with name (sync)', t => {
  let lambdaHandler = standardLambdaResponse(funcSync)
  let ev = { type: 'error-name' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'SomeNamedError',
      description: 'Some error with name',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch text error (sync)', t => {
  let lambdaHandler = standardLambdaResponse(funcSync)
  let ev = { type: 'error-text' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'Error',
      description: 'Some text error',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch text error (async)', t => {
  let lambdaHandler = standardLambdaResponse(funcAsync)
  let ev = { type: 'error-text' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'Error',
      description: 'Some text error',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch object error (async)', t => {
  let lambdaHandler = standardLambdaResponse(funcAsync)
  let ev = { type: 'error-obj' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'Error',
      description: 'Some error object',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch object error (async)', t => {
  let lambdaHandler = standardLambdaResponse(funcAsync)
  let ev = { type: 'error-obj2' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'Error',
      description: 'Unknown error',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response catch inner throw (async)', t => {
  let lambdaHandler = standardLambdaResponse(funcAsync)
  let ev = { type: 'throw' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.deepEqual(data, {
      ok: false,
      name: 'Error',
      description: 'Some error thrown',
      format: FORMAT
    }, 'cb data argument should meet the specification')
    t.end()
  })
})

test('standard response this stack (async)', t => {
  let lambdaHandler = standardLambdaResponse(funcAsync, { debug: true })
  let ev = { type: 'throw' }

  lambdaHandler(ev, null, function (err, data) {
    t.equal(err, null, 'cb error argument should be null')
    t.equal(data.ok, false)
    t.ok(data.stack instanceof Array)
    t.equal(data.stack[0], 'Error: Some error thrown')
    t.end()
  })
})
