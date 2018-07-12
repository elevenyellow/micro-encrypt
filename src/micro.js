const micro = require('micro')
const resolver = require('./resolver')

module.exports = function(options = {}) {
    const _resolver = options.resolver || resolver
    return micro((req, res) => _resolver(req, res, options))
}
