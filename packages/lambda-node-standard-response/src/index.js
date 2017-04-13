'use strict'

const isPromise = require('is-promise')

function makeCb (err, data, cb) {
  let response = {
    format: '1.0'
  }

  if (err) {
    if (typeof err === 'string') {
      err = new Error(err)
    } else if (!(err instanceof Error)) {
      response.error = err
      err = new Error('Unknown error')
    }

    Object.assign(response, {
      ok: false,
      description: err.message
    })

    if (err.code != null) response.error_code = err.code
  } else {
    Object.assign(response, {
      ok: true,
      result: data
    })
  }

  return cb(null, response)
}

module.exports = function lambdaNodeStandardResponse (handler) {
  return function (ev, ctx, cb) {
    try {
      let result = handler(ev, ctx)
      if (isPromise(result)) {
        result
          .then(res => makeCb(null, res, cb))
          .catch(err => makeCb(err, null, cb))
      } else {
        makeCb(null, result, cb)
      }
    } catch (e) {
      makeCb(e, null, cb)
    }
  }
}
