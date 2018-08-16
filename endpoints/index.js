const glob = require('glob')
const path = require('path')
const Route = require('route-parser')
const { status } = require('../const')

function create(route, f) {
    return { route: new Route(route), f: f }
}

function load(url) {
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



module.exports = {
    create,
    load
}
