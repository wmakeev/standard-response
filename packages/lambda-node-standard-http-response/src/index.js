'use strict'

const standardResponse = require('@wmakeev/lambda-node-standard-response')

module.exports = function lambdaNodeStandardHttpResponse (handler, options) {
  options = options || {}
  const stdResHandler = standardResponse(handler, { debug: options.debug || false })

  return function (ev, ctx, cb) {
    stdResHandler(ev, ctx, (err, result) => {
      if (err) return cb(err)
      if (!result) return cb(new Error('Empty result'))

      let response = {
        isBase64Encoded: options.isBase64Encoded || false,
        statusCode: 200
        // "headers": { "headerName": "headerValue", ... },
      }

      if (response.isBase64Encoded && result.ok) {
        response.body = result.result
      } else {
        response.body = JSON.stringify(result)
      }

      cb(null, response)
    })
  }
}
