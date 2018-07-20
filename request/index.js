const rp = require('request-promise')
const { key } = require('../const')
const { encrypt, decrypt } = require('../encryption')

module.exports = async (...args) => {
    // Getting options object
    const options_index = isObject(args[0]) ? 0 : 1
    if (!isObject(args[options_index])) args[options_index] = {}
    const options = args[options_index]

    // Getting encryption
    let is_encrypted = false
    let API_KEY, API_SECRET
    const encryption = options[key.ENCRYPTION]
    if (
        isObject(encryption) &&
        typeof encryption[key.API_KEY] == 'string' &&
        typeof encryption[key.API_SECRET] == 'string'
    ) {
        is_encrypted = true
        API_KEY = encryption[key.API_KEY]
        API_SECRET = encryption[key.API_SECRET]
    }

    if (is_encrypted) {
        // Adding Authorization
        if (!options.hasOwnProperty('headers')) options.headers = {}
        if (!options.headers.hasOwnProperty(key.AUTHORIZATION))
            options.headers[key.AUTHORIZATION] = API_KEY

        // Encrypting
        if (options.hasOwnProperty('body'))
            options.body = encrypt(options.body, API_SECRET)
    }

    try {
        const result = await rp.apply(this, args)
        return is_encrypted ? decrypt(result, API_SECRET) : result
    } catch (e) {
        // Decrypt always if status code is not 401 (Unauthorized)
        if (is_encrypted && e.statusCode !== 401)
            e.error = decrypt(e.error, API_SECRET)
        else {
            try {
                e.error = JSON.parse(e.error)
            } catch (e) {}
        }
        throw e
    }
}

function isObject(object) {
    return object !== null && typeof object == 'object'
}
