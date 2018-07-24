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

test('echoEndpoint without encryption', async t => {
    const body = { Hello: 'World' }
    const result = await request(`${url}/echoEndpoint`, { body })
    t.deepEqual(result, body)
})

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
        t.is(e.statusCode, 404)
        t.deepEqual(e.error, { message: 'Not Found' })
    }
})

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

test('customCode 201 Created', async t => {
    const data = { message: 'Created' }
    const body = { statusCode: 201, body: data }
    const result = await request(`${url}/customCode`, { body, encryption })
    t.deepEqual(result, data)
})

test('customCode 202 Accepted', async t => {
    const data = { message: 'Accepted' }
    const body = { statusCode: 202, body: data }
    const result = await request(`${url}/customCode`, { body, encryption })
    t.deepEqual(result, data)
})

test('customCode 204 No Content', async t => {
    const data = { message: 'No Content' }
    const body = { statusCode: 204, body: data }
    const result = await request(`${url}/customCode`, { body, encryption })
    t.deepEqual(result, '')
})

test('customCode 205 Reset Content', async t => {
    const data = { message: 'Reset Content' }
    const body = { statusCode: 205, body: data }
    const result = await request(`${url}/customCode`, { body, encryption })
    t.deepEqual(result, data)
})

test('customCode 206 Partial Content', async t => {
    const data = { message: 'Partial Content' }
    const body = { statusCode: 206, body: data }
    const result = await request(`${url}/customCode`, { body, encryption })
    t.deepEqual(result, data)
})

test('customCode 301 Moved Permanently', async t => {
    const data = { message: 'Moved Permanently' }
    const body = { statusCode: 301, body: data }
    try {
        await request(`${url}/customCode`, { body, encryption })
    } catch (e) {
        t.is(e.statusCode, body.statusCode)
        t.deepEqual(e.error, data)
    }
})

test('customCode 400 Bad request', async t => {
    const data = { message: 'Bad request' }
    const body = { statusCode: 301, body: data }
    try {
        await request(`${url}/customCode`, { body, encryption })
    } catch (e) {
        t.is(e.statusCode, body.statusCode)
        t.deepEqual(e.error, data)
    }
})

test('customCode 501 Not Implemented', async t => {
    const data = { message: 'Not Implemented' }
    const body = { statusCode: 501, body: data }
    try {
        await request(`${url}/customCode`, { body, encryption })
    } catch (e) {
        t.is(e.statusCode, body.statusCode)
        t.deepEqual(e.error, data)
    }
})

test('options', async t => {
    const result = await request(`${url}/echoOptions`, { encryption })
    t.deepEqual(result, JSON.parse(JSON.stringify(options)))
})

// test('Clossing server', async t => {
//     t.deepEqual(typeof server.close(), 'Yeah!!')
// })
