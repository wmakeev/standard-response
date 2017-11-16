'use strict'

const isPromise = require('is-promise')

const FORMAT = '2.0'

function getMakeCb (options) {
  let debug = !!options.debug

  return function makeCb (err, data, cb) {
    let response = {
      format: FORMAT
    }

    if (err) {
      if (typeof err === 'string') {
        err = new Error(err)
      } else if (!(err instanceof Error)) {
        let message = (err && err.message && typeof err.message === 'string')
          ? err.message : 'Unknown error'
        err = new Error(message)
      }

      Object.assign(response, {
        ok: false,
        description: err.message
      })

      if (err.name) response.error_name = err.name

      if (debug) response.error_stack = String(err.stack).split(/\n/)

      if (err.code != null) response.error_code = err.code
    } else {
      Object.assign(response, {
        ok: true,
        result: data
      })
    }

    return cb(null, response)
  }
}

module.exports = function lambdaNodeStandardResponse (handler, options) {
  let makeCb = getMakeCb(options || {})
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
