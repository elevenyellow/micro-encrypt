const { send, text } = require('micro')
const { encrypt, decrypt, stringify, parse } = require('../encryption')
const { status, key } = require('../const')

// Handler that resolve all the requests before is passed to the endpoint
module.exports = async function(req, res, options) {
    const { auths, endpoints } = options
    const api_key = req.headers[key.AUTHORIZATION]
    const api_secret = auths[api_key]
    const authorized = auths.hasOwnProperty(api_key)

    if (api_key !== undefined && !authorized) {
        send(res, status.UNAUTHORIZED.code, {
            message: status.UNAUTHORIZED.message
        })
    } else {
        const sendEncrypted = (res, status_code, body) =>
            send(
                res,
                status_code,
                authorized ? encrypt(body, api_secret) : stringify(body)
            )
        const endpoints_match = endpoints.filter(
            endpoint => endpoint.route.match(req.url) !== false
        )
        if (endpoints_match.length > 0) {
            const body_text = await text(req)
            req[key.AUTHORIZED] = authorized
            req[key.API_KEY] = api_key
            req[key.API_SECRET] = api_secret
            req.body = authorized
                ? decrypt(body_text, api_secret)
                : parse(body_text)
            req.route = endpoints_match[0].route
            const body = await endpoints_match[0].f(
                req,
                res,
                sendEncrypted,
                options
            )
            if (body !== undefined) {
                return authorized ? encrypt(body, api_secret) : stringify(body)
            }
        } else {
            const body = {
                message: status.NOT_FOUND.message
            }
            sendEncrypted(res, status.NOT_FOUND.code, body)
        }
    }
}
