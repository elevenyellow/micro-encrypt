const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const resolver = require('../src/resolver')

test('getAddressForDeposit', async t => {
    const service = micro(resolver)
    const url = await listen(service)
    const body = await request(`${url}/getAddressForDeposit`)
    t.deepEqual(body, 'Yeah!')
    service.close()
})
