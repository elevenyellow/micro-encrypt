const glob = require('glob')
const path = require('path')
const url = require('url')
const { send } = require('micro')
const { NOT_FOUND } = require('./status_codes')

const endpoint_resolver = {}
glob.sync('./src/endpoint/*.js').forEach(file => {
    const basename = path.basename(file)
    const name = basename.substr(0, basename.length - 3)
    endpoint_resolver[name] = require(path.resolve(file))
})

module.exports = async (req, res) => {
    const urlparsed = url.parse(req.url).pathname.split('/')
    const name = urlparsed[1]
    return 'Yeah!'
    if (endpoint_resolver[name] === undefined) {
        send(res, NOT_FOUND, '')
    } else {
        return await endpoint_resolver[name](req, res)
    }
}
