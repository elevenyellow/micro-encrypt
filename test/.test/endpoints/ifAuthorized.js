const { ifAuthorized } = require('../../../endpoints')

module.exports = ifAuthorized(async () => true)
