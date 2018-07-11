const glob = require('glob')
const path = require('path')

module.exports = function(url) {
    const endpoint_resolver = {}
    glob.sync(url).forEach(file => {
        const f = require(path.resolve(file))
        const basename = path.basename(file)
        const name =
            f.name && f.name.length > 0
                ? f.name
                : basename.substr(0, basename.length - 3)
        endpoint_resolver[name] = f
    })
    return endpoint_resolver
}
