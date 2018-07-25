const rp = require('request-promise')
const { key } = require('../const')
const { encrypt, decrypt, parse, stringify } = require('../encryption')

module.exports = async (...args) => {
    // Getting options object
    const options_index = isObject(args[0]) ? 0 : 1
    if (!isObject(args[options_index])) args[options_index] = {}
    const options = args[options_index]

    // Getting encryption
    let is_encrypted = false
    let API_KEY, API_SECRET
    const encryption = options[key.ENCRYPTION]
    delete options[key.ENCRYPTION]

    if (
        isObject(encryption) &&
        typeof encryption[key.API_KEY] == 'string' &&
        typeof encryption[key.API_SECRET] == 'string'
    ) {
        is_encrypted = true
        API_KEY = encryption[key.API_KEY]
        API_SECRET = encryption[key.API_SECRET]
    }

    // Adding Authorization
    if (is_encrypted) {
        if (!options.hasOwnProperty('headers')) options.headers = {}
        if (!options.headers.hasOwnProperty(key.AUTHORIZATION))
            options.headers[key.AUTHORIZATION] = API_KEY
    }

    // Encrypting
    if (options.hasOwnProperty('body'))
        options.body = is_encrypted
            ? encrypt(options.body, API_SECRET)
            : stringify(options.body)

    try {
        const result = await rp.apply(this, args)
        return is_encrypted ? decrypt(result, API_SECRET) : parse(result)
    } catch (e) {
        // This happen if e.statusCode is not 200
        e.error =
            is_encrypted && e.statusCode !== 401 // Decrypt always if status code is not 401 (Unauthorized)
                ? decrypt(e.error, API_SECRET)
                : parse(e.error)

        throw e
    }
}

function isObject(object) {
    return object !== null && typeof object == 'object'
}
