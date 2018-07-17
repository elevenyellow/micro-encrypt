const rp = require('request-promise')
const { key } = require('../const')
const { encrypt, decrypt } = require('../encryption')

module.exports = function(auth, password) {
    return async (...args) => {
        // Getting options object
        const options_index = isObject(args[0]) ? 0 : 1
        if (!isObject(args[options_index])) args[options_index] = {}
        const options = args[options_index]

        // Adding Authorization
        if (!options.hasOwnProperty('headers')) options.headers = {}
        if (!options.headers.hasOwnProperty(key.AUTHORIZATION))
            options.headers[key.AUTHORIZATION] = auth

        // Encrypting
        if (options.hasOwnProperty('body'))
            options.body = encrypt(options.body, password)

        try {
            const result = await rp.apply(this, args)
            return decrypt(result, password)
        } catch (e) {
            // Decrypt always if status code is not 401 (Unauthorized)
            if (e.statusCode !== 401) e.error = decrypt(e.error, password)
            else {
                try {
                    e.error = JSON.parse(e.error)
                } catch (e) {}
            }
            throw e
        }
    }
}

function isObject(object) {
    return object !== null && typeof object == 'object'
}
