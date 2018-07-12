const { send } = require('micro')
const { encrypt, decrypt } = require('easy-encrypt/aes256ctr')
const { UNAUTHORIZED, NOT_FOUND } = require('./status_codes')
const Route = require('route-parser')

// Handler that resolve all the requests before is passed to the route
module.exports = async (req, res, options) => {
    const { auths, routes } = options
    const authorization = req.headers.authorization
    const password = auths[authorization]

    if (authorization === null || password === undefined) {
        send(res, UNAUTHORIZED.code, {
            message: UNAUTHORIZED.message,
            error: UNAUTHORIZED.code
        })
    } else {
        const routes_match = routes.filter(
            route => route.route.match(req.url) !== false
        )
        if (routes_match.length > 0) {
            return await routes[0].f(req, res, options)
        } else {
            send(res, NOT_FOUND.code, {
                message: NOT_FOUND.message,
                error: NOT_FOUND.code
            })
        }
    }
}
