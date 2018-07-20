A small library to create micro-services with AES-256-CTR encryption on top of [micro](https://github.com/zeit/micro).

# Install

`npm i micro-encrypt`

# Usage

## auths

To use this library the first thing you have to do is create a json file where you define all of your authentications/users. The format is key/value.

Every key of the json is an user. We will call it `API_KEY`, and the value of that `API_KEY` is the `API_SECRET`. You can add as much as you want. Use just one `API_KEY` for each client you connect with.

Example:

```json
{
    "04f8996da763b7a969b211da63548b10": "my_password",
    "canbe_an_email@domain.com": "password2",
    ...
}
```

## /micro

This module is a wrapper of [micro](https://github.com/zeit/micro) with the difference that you have to pass an `object` with two mandatory parameters:

-   auths: `Object`

-   endpoints: `Array`

```js
const micro = require('micro-encrypt/micro')
const { create } = require('micro-encrypt/endpoints')
const auths = {
    user1213151: 'the_password'
}
const endpoints = []
endpoints.push(create('/hello', () => 'world'))

const server = micro({ auths, endpoints })
server.listen(3000)
```

## /endpoints

to do

## /request

This module is just a function that creates a wrapper of [request-promise](https://github.com/request/request-promise) which is also a promise wrapper of [request](https://github.com/request/request).

```js
const request = require('micro-encrypt/request')
const encryption = { API_KEY, API_SECRET } // Any of those you have defined previously in auths.json
const body = { symbol: 'BTC' }
const address = await request(`${url}/getAddressForDeposit`, { body, encryption })
```

If you want to use [request](https://github.com/request/request) as standalone you can do it this way:

```js
const request = require('request')
const { encrypt, decrypt } = require('micro-encrypt/encryption')
const body = encrypt({ symbol: 'BTC' }, API_SECRET)
const headers = { API_KEY: API_KEY }
request(
    `${url}/getAddressForDeposit`,
    { body, headers },
    (error, response, body) => {
        const address = decrypt(body, API_SECRET)
    }
)
```

## /encryption

to do
