// const { send } = require('micro')

module.exports = async (req, res, options) => {
    // send(res, status_codes.OK, 'Hello world')
    return req.body
}
