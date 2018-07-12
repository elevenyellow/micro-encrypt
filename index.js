const micro = require('./src/micro')
const { load } = require('./src/routes')
const auths = require('./auths')
const { port } = require('./settings')

const server = micro({
    auths: auths,
    routes: load('./endpoints/*.js')
})
server.listen(port)
console.log(`Server is listening on ${port}`)
