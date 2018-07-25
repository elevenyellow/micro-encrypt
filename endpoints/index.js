const glob = require('glob')
const path = require('path')
const Route = require('route-parser')
const { status } = require('../const')

exports.create = create = function(route, f) {
    return { route: new Route(route), f: f }
}

exports.load = function(url) {
    return glob.sync(url).map(file => {
        const f = require(path.resolve(file))
        const basename = path.basename(file)
        const route =
            '/' +
            (f.name && f.name.length > 0
                ? f.name
                : basename.substr(0, basename.length - 3))
        return create(route, f)
    })
}

exports.ifAuthorized = function(f) {
    return (...args) => {
        const req = args[0]
        const send = args[2]
        return req.authorized ? f(...args) : send(status.UNAUTHORIZED)
    }
}
