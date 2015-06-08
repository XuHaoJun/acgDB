var Immutable = require('immutable');
var url = require('url');

var redisURL;

var auth_pass = null;
var _redisURL;
var _redisURLs = {
  heroku: process.env.REDIS_URL,
  redisColud: process.env.REDISCLOUD_URL
};

if (_redisURLs.heroku) {
  _redisURL = url.parse(_redisURLs.heroku);
  auth_pass = _redisURL.auth.split(":")[1];
} else if(_redisURLs.redisColud) {
  _redisURL = url.parse(_redisURLs.redisColud);
  auth_pass = _redisURL.auth.split(":")[1];
}

var redisConfig = {
  develop: {
    url: 'redis://localhost:6379',
    port: 6379,
    hostanme: 'localhost',
    options: {
      detect_buffers: true
    }
  },
  production: {
    url: _redisURLs.heroku,
    port: (_redisURL ? _redisURL.port : 6379),
    hostname: (_redisURL ? _redisURL.hostname : 'localhost'),
    options: {
      auth: auth_pass,
      auth_pass: auth_pass,
      enableReadyCheck: false,
      detect_buffers: true,
      no_ready_check: true
    }
  }
};

var _config = redisConfig.develop;
if (redisConfig.production !== undefined && process.env.NODE_ENV == 'production') {
  _config = redisConfig.production;
}

_config = Immutable.fromJS(_config);

module.exports = {
  get: function() {
    return _config;
  },
  getURL: function() {
    return _config.get('url');
  },
  getClient: function() {
    return _config.get('client');
  },
  getHostname: function() {
    return _config.get('hostname');
  },
  getOptions: function() {
    return _config.get('options') || Immutable.Map({});
  },
  getPort: function() {
    return _config.get('port');
  },
  getJSON: function() {
    return _config.toJSON();
  }
};
