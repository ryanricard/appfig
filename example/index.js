process.env.APP_ENV = process.env.APP_ENV || 'development';

const appfig = require('../index');
const { APP_ENV } =  process.env;

const config = appfig(__dirname + `/config/${APP_ENV}.json`);

console.log(config.get('port'));
console.log(config.get('logLevel'));
console.log(config.get('services:users'));