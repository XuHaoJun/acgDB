var _ = require('lodash');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

function _genid(req) {
  return req.id;
}

//             milSec sec  min  day week
var oneWeek = 1000 * 60 * 60 * 24 * 7;

var sessionConfig = {
  develop: {
    secret: 'YourSecretKey',
    store: {client: 'redis'},
    resave: false,
    saveUninitialized: false,
    genid: _genid
  },
  production: {
    secret: 'YourSecretKey',
    store: {client: 'redis'},
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: oneWeek
    },
    genid: _genid
  }
};

var _config = sessionConfig.develop;
if (sessionConfig.production !== undefined && process.env.NODE_ENV == 'production') {
  _config = sessionConfig.production;
}

module.exports = _config;
