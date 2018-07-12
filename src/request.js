const request = require('request-promise')
const { encrypt, decrypt } = require('./encryption')

module.exports = function(auth, password) {
    return async (...args) => {
        // const args = Array.prototype.slice.call(arguments, 0)
        const options_index = isObject(args[0]) ? 0 : 1
        if (!isObject(args[options_index])) args[options_index] = {}
        const options = args[options_index]

        // Adding Authorization
        if (!options.hasOwnProperty('headers')) options.headers = {}
        if (!options.headers.hasOwnProperty('Authorization'))
            options.headers.Authorization = auth

        // Encrypting
        if (options.hasOwnProperty('body'))
            options.body = encrypt(options.body, password)

        return await request.apply(this, args)
    }
}

function isObject(object) {
    return object !== null && typeof object == 'object'
}
