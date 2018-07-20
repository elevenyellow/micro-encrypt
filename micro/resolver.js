const { send, text } = require('micro')
const { encrypt, decrypt } = require('../encryption')
const { status, key } = require('../const')

// Handler that resolve all the requests before is passed to the endpoint
module.exports = async function(req, res, options) {
    const { auths, endpoints } = options
    const authorization = req.headers[key.AUTHORIZATION]
    const password = auths[authorization]

    if (authorization === null || password === undefined) {
        send(res, status.UNAUTHORIZED.code, {
            message: status.UNAUTHORIZED.message
        })
    } else {
        const sendEncrypted = (res, status_code, data) =>
            send(res, status_code, encrypt(data, password))
        const endpoints_match = endpoints.filter(
            endpoint => endpoint.route.match(req.url) !== false
        )
        if (endpoints_match.length > 0) {
            req.API_KEY = authorization
            req.API_SECRET = password
            req.body = decrypt(await text(req), password)
            req.route = endpoints_match[0].route
            const value = await endpoints_match[0].f(
                req,
                res,
                sendEncrypted,
                options
            )
            if (value !== undefined) {
                return encrypt(value, password)
            }
        } else {
            const data = {
                message: status.NOT_FOUND.message
            }
            sendEncrypted(res, status.NOT_FOUND.code, data)
        }
    }
}
