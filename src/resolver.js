const glob = require('glob')
const path = require('path')
const url = require('url')
const { send } = require('micro')
const { UNAUTHORIZED, NOT_FOUND } = require('./status_codes')
const authoritations = require('./authorizations')

// Loading all endpoints
const endpoint_resolver = {}
glob.sync('./src/endpoint/*.js').forEach(file => {
    const basename = path.basename(file)
    const name = basename.substr(0, basename.length - 3)
    endpoint_resolver[name] = require(path.resolve(file))
})

// Handler that resolve all the requests before is passed to the endpoint
module.exports = async (req, res) => {
    const authorization = req.headers.authorization
    const urlparsed = url.parse(req.url)
    const pathname = urlparsed.pathname.split('/')
    const name = pathname[1]
    const password = authoritations[authorization]

    if (authorization === null || password === undefined) {
        send(res, UNAUTHORIZED, {
            message: 'Unauthorized',
            code: UNAUTHORIZED
        })
    } else if (endpoint_resolver[name] === undefined) {
        send(res, NOT_FOUND, {
            message: 'Not Found',
            code: NOT_FOUND
        })
    } else {
        return await endpoint_resolver[name](req, res, urlparsed)
    }
}
