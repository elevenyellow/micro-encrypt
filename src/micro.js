const micro = require('micro')
const { encrypt, decrypt } = require('easy-encrypt/aes256ctr')
const resolver = require('./resolver')

module.exports = function(options = {}) {
    const _resolver = options.resolver || resolver
    if (
        typeof options.encrypt != 'function' ||
        typeof options.decrypt != 'function'
    ) {
        options.encrypt = encrypt
        options.decrypt = decrypt
    }
    return micro((req, res) => _resolver(req, res, options))
}
