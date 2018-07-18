module.exports = async (req, res, send, options) => {
    send(res, req.body.statusCode, req.body)
}
