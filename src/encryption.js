const encryption = require('easy-encrypt/aes256ctr')

exports.encrypt = encrypt = (text, password) => {
    const type = typeof text
    if (text !== null && type === 'object') text = JSON.stringify(text)
    if (type !== 'string') text = String(text)
    return encryption.encrypt(text, password)
}

exports.decrypt = decrypt = (text, password) => {
    text = encryption.decrypt(text, password)
    try {
        text = JSON.parse(text)
    } catch (e) {}
    return text
}
