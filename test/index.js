const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const micro = require('../src/micro')
const { load } = require('../src/endpoints')
const auths = require('../auths')
const { encrypt, decrypt } = require('../src/encryption')

let port = 4444
let url = `http://localhost:${port}`
let API_KEY
let API_SECRET
// Loading first user/auth
for (API_KEY in auths) {
    API_SECRET = auths[API_KEY]
    break
}
let headers = {
    Authorization: API_KEY
}
let server = micro({
    auths: auths,
    endpoints: load('./endpoints/*.js')
})
server.listen(port)

test('Unauthorized', async t => {
    try {
        const body = await request(`${url}`)
    } catch (e) {
        const data = JSON.parse(e.error)
        t.is(data.error, 401)
    }
})

test('Not found', async t => {
    try {
        const body = await request(`${url}`, { headers })
    } catch (e) {
        const data = decrypt(e.error, API_SECRET)
        t.is(data.error, 402)
    }
})

test('echoEndpoint', async t => {
    const data = { Hello: 'World' }
    const body = await request(`${url}/echoEndpoint`, {
        headers,
        body: encrypt(data, API_SECRET)
    })
    t.deepEqual(decrypt(body, API_SECRET), data)
})

// test('Clossing server', async t => {
//     t.deepEqual(typeof server.close(), 'Yeah!!')
// })
