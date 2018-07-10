const { send } = require('micro')

module.exports = async (req, res) => {
    return 'Yeah!'
    // send(res, status_codes.OK, 'Hello world')
}
