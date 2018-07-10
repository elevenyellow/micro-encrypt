const micro = require('micro')
const resolver = require('./resolver')
const { port } = require('./settings')

const server = micro(resolver)
server.listen(port)
console.log(`Server is listening on ${port}`)
