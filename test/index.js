const test = require('ava')
const createRequest = require('../src/request')
const micro = require('../src/micro')
const { load } = require('../src/endpoints')
const auths = require('../auths')

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
    endpoints: load('./endpoints/*.js')
})
server.listen(port)

test('Unauthorized', async t => {
    const request = createRequest('Not real api', 'Not real password')
    try {
        const body = await request(`${url}`)
    } catch (e) {
        const data = JSON.parse(e.error)
        t.is(data.error, 401)
    }
})

test('Not found', async t => {
    const request = createRequest(API_KEY, API_SECRET)
    try {
        const body = await request(`${url}`)
    } catch (e) {
        t.deepEqual(e.error, {
            error: 402,
            message: 'Not Found'
        })
    }
})

test('echoEndpoint', async t => {
    const request = createRequest(API_KEY, API_SECRET)
    const data = { Hello: 'World' }
    const body = await request(`${url}/echoEndpoint`, { body: data })
    t.deepEqual(body, data)
})

// test('Clossing server', async t => {
//     t.deepEqual(typeof server.close(), 'Yeah!!')
// })
