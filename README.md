# appfig

Combines [nconf](https://github.com/indexzero/nconf), [recurpolate](https://github.com/AndersDJohnson/recurpolate), and declarative JSON `"extends"` syntax to create an extremely useful configuration loader. 

[![Build Status](https://travis-ci.org/ryanricard/appfig.svg?branch=master)](https://travis-ci.org/ryanricard/appfig)
[![Coverage Status](https://coveralls.io/repos/github/ryanricard/appfig/badge.svg?branch=master)](https://coveralls.io/github/ryanricard/appfig?branch=master)

## Usage

All the value packed into `appfig` is demonstrated in `./example`, which is summarized for your reading below. `appfig` is compatible with Node 8+. Enjoy.

config/default.json
```json
{
  "port": 3000,
  "logLevel": "debug",
  "services": {
    "users": "http://${host}/users"
  }
}
```

config/development.json
```json
{
  "extends": "default",
  "host": "dev.example.com"
}
```

config/production.json
```json
{
  "extends": "default",
  "port": 3001,
  "logLevel": "info",
  "host": "www.example.com"
}
```

index.js
```js
process.env.APP_ENV = process.env.APP_ENV || 'development';

const { APP_ENV } =  process.env;

const config = require('appfig')(__dirname + `/config/${APP_ENV}.json`);

console.log(config.get('port'));
console.log(config.get('logLevel'));
console.log(config.get('services:users'));
```

Starting your application with development configuration

```shell
$ node index.js

3000
trace
http://dev.example.com/users
```

Starting your application with production configuration

```shell
$ APP_ENV=production node index.js

3001
info
http://www.example.com/users
```

## Use it
`appfig` is released under the MIT License.
