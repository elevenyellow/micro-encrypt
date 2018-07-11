const url = require('url')
const { send } = require('micro')
const { UNAUTHORIZED, NOT_FOUND } = require('./status_codes')

// Handler that resolve all the requests before is passed to the endpoint
module.exports = async (req, res, options) => {
    const { auths, endpoints, encrypt, decrypt } = options
    const authorization = req.headers.authorization
    const urlparsed = url.parse(req.url)
    const pathname = urlparsed.pathname.split('/')
    const name = pathname[1]
    const password = auths[authorization]

    if (authorization === null || password === undefined) {
        send(res, UNAUTHORIZED.code, {
            message: UNAUTHORIZED.message,
            error: UNAUTHORIZED.code
        })
    } else if (endpoints[name] === undefined) {
        send(res, NOT_FOUND.code, {
            message: NOT_FOUND.message,
            error: NOT_FOUND.code
        })
    } else {
        return await endpoints[name](req, res, options)
    }
}
