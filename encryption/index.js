const encryption = require('easy-encrypt/aes256ctr')

function encrypt(data, password) {
    return encryption.encrypt(stringify(data), password)
}

function decrypt(data, password) {
    return parse(encryption.decrypt(data, password))
}

function stringify(data) {
    const type = typeof data
    if (data !== null && type === 'object') data = JSON.stringify(data)
    if (type !== 'string') data = String(data)
    return data
}

function parse(data) {
    try {
        data = JSON.parse(data)
    } catch (e) {}
    return data
}

module.exports = {
    encrypt,
    decrypt,
    stringify,
    parse
}
