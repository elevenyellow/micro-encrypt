const encryption = require('easy-encrypt/aes256ctr')

exports.encrypt = encrypt = function(data, password) {
    return encryption.encrypt(stringify(data), password)
}

exports.decrypt = decrypt = function(data, password) {
    return parse(encryption.decrypt(data, password))
}

exports.stringify = stringify = function(data) {
    const type = typeof data
    if (data !== null && type === 'object') data = JSON.stringify(data)
    if (type !== 'string') data = String(data)
    return data
}

exports.parse = parse = function(data) {
    try {
        data = JSON.parse(data)
    } catch (e) {}
    return data
}
