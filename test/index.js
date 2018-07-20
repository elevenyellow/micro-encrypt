const test = require('ava')
const request = require('../request')
const micro = require('../micro')
const { load } = require('../endpoints')
const auths = require('./.test/auths')

let port = 4444
let url = `http://localhost:${port}`
let API_KEY
let API_SECRET
// Loading first user/auth
for (API_KEY in auths) {
    API_SECRET = auths[API_KEY]
    break
}
const encryption = { API_KEY, API_SECRET }
const options = {
    auths: auths,
    endpoints: load('./test/.test/endpoints/*.js')
}
const server = micro(options)
server.listen(port)

test('Unauthorized', async t => {
    try {
        const result = await request(`${url}`, {
            encryption: {
                API_KEY: 'notreal',
                API_SECRET: 'notreal'
            }
        })
    } catch (e) {
        t.is(e.statusCode, 401)
        t.deepEqual(e.error, { message: 'Unauthorized' })
    }
})

test('Not found', async t => {
    try {
        const result = await request(`${url}`, { encryption })
    } catch (e) {
        t.is(e.statusCode, 402)
        t.deepEqual(e.error, { message: 'Not Found' })
    }
})

// test('echoEndpoint without encryption', async t => {
//     const body = { Hello: 'World' }
//     const result = await request(`${url}/echoEndpoint`, { body })
//     t.deepEqual(result, body)
// })

test('echoEndpoint JSON', async t => {
    const body = { Hello: 'World' }
    const result = await request(`${url}/echoEndpoint`, { body, encryption })
    t.deepEqual(result, body)
})

test('echoEndpoint String', async t => {
    const body = 'Hello World'
    const result = await request(`${url}/echoEndpoint`, { body, encryption })
    t.deepEqual(result, body)
})

test('echoEndpoint Number', async t => {
    const body = 12345
    const result = await request(`${url}/echoEndpoint`, { body, encryption })
    t.deepEqual(result, body)
})

test('customError (statusCode)', async t => {
    const body = { statusCode: 501, message: 'Not Implemented' }
    try {
        const result = await request(`${url}/customError`, { body, encryption })
    } catch (e) {
        t.is(e.statusCode, body.statusCode)
        t.deepEqual(e.error, body)
    }
})

test('options', async t => {
    const result = await request(`${url}/echoOptions`, { encryption })
    t.deepEqual(result, JSON.parse(JSON.stringify(options)))
})

// test('Clossing server', async t => {
//     t.deepEqual(typeof server.close(), 'Yeah!!')
// })
