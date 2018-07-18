const test = require('ava')
const createRequest = require('../request')
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

let server = micro({
    auths: auths,
    endpoints: load('./test/.test/endpoints/*.js')
})
server.listen(port)

test('Unauthorized', async t => {
    const request = createRequest('Not real api', 'Not real password')
    try {
        const result = await request(`${url}`)
    } catch (e) {
        t.is(e.statusCode, 401)
        t.deepEqual(e.error, { message: 'Unauthorized' })
    }
})

test('Not found', async t => {
    const request = createRequest(API_KEY, API_SECRET)
    try {
        const result = await request(`${url}`)
    } catch (e) {
        t.is(e.statusCode, 402)
        t.deepEqual(e.error, { message: 'Not Found' })
    }
})

test('echoEndpoint JSON', async t => {
    const request = createRequest(API_KEY, API_SECRET)
    const body = { Hello: 'World' }
    const result = await request(`${url}/echoEndpoint`, { body })
    t.deepEqual(result, body)
})

test('echoEndpoint String', async t => {
    const request = createRequest(API_KEY, API_SECRET)
    const body = 'Hello World'
    const result = await request(`${url}/echoEndpoint`, { body })
    t.deepEqual(result, body)
})

test('echoEndpoint Number', async t => {
    const request = createRequest(API_KEY, API_SECRET)
    const body = 12345
    const result = await request(`${url}/echoEndpoint`, { body })
    t.deepEqual(result, body)
})

test('customError (statusCode)', async t => {
    const request = createRequest(API_KEY, API_SECRET)
    const body = { statusCode: 501, message: 'Not Implemented' }
    try {
        const result = await request(`${url}/customError`, { body })
    } catch (e) {
        t.is(e.statusCode, body.statusCode)
        t.deepEqual(e.error, body)
    }
})

// test('Clossing server', async t => {
//     t.deepEqual(typeof server.close(), 'Yeah!!')
// })
