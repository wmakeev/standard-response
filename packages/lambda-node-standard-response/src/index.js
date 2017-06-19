'use strict'

const isPromise = require('is-promise')

const FORMAT = '1.1'

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
        err = new Error('Unknown error')
      }

      Object.assign(response, {
        ok: false,
        description: err.message
      })

      if (debug && err.stack) response.stack = String(err.stack).split(/\n/)

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
