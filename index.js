const micro = require('./src/micro')
const load = require('./src/load')
const auths = require('./auths')
const { port } = require('./settings')

const server = micro({
    auths: auths,
    endpoints: load('./endpoints/*.js')
})
server.listen(port)
console.log(`Server is listening on ${port}`)
