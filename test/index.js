const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const resolver = require('../src/resolver')

let service
let url

const API_KEY =
    '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb'
const API_SECRET = 'my_password'

test('getAddressForDeposit', async t => {
    service = micro(resolver)
    url = await listen(service)

    const body = await request(`${url}/getAddressForDeposit`, {
        headers: {
            Authorization: 'API_KEY'
        }
    })
    t.deepEqual(body, 'Yeah!!')
})

// test('getAddressForDeposit', async t => {
//     const body = await request(`${url}/getAddressForDeposit`)
//     t.deepEqual(body, 'Yeah!!!')
//     service.close()
// })
