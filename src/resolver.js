const { send, text } = require('micro')
const { encrypt, decrypt } = require('./encryption')
const { UNAUTHORIZED, NOT_FOUND } = require('./status_codes')
const Route = require('route-parser')

// Handler that resolve all the requests before is passed to the endpoint
module.exports = async function(req, res, options) {
    const { auths, endpoints } = options
    const authorization = req.headers.authorization
    const password = auths[authorization]

    if (authorization === null || password === undefined) {
        send(res, UNAUTHORIZED.code, {
            message: UNAUTHORIZED.message,
            error: UNAUTHORIZED.code
        })
    } else {
        const endpoints_match = endpoints.filter(
            endpoint => endpoint.route.match(req.url) !== false
        )
        if (endpoints_match.length > 0) {
            req.body = decrypt(await text(req), password)
            const value = await endpoints[0].f(req, res, options)
            return encrypt(value, password)
        } else {
            const data = {
                message: NOT_FOUND.message,
                error: NOT_FOUND.code
            }
            send(res, NOT_FOUND.code, encrypt(data, password))
        }
    }
}
