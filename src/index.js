const http = require('http')
const settings = require('../settings')
const requestHandler = require('./requestHandler')

const server = http.createServer(requestHandler)

server.listen(settings.port, err => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`Server is listening on ${settings.port}`)
})
