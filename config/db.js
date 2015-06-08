var dbConfig = {
  develop: {
    client: 'pg',
    mysql: {
      connection: {
        host     : 'localhost',
        user     : 'root',
        password : 'yourPassword',
        database : 'nanashi'
      }
    },
    pg: {
      connection: 'postgres://postgres:postgres@localhost/nanashi',
      pool: {
        min: 0,
        max: 2
      }
    }
  },
  production: {
    client: 'pg',
    pg: {
      connection: process.env.HEROKU_POSTGRESQL_TEAL_URL,
      pool: {
        min: 0,
        max: 2
      }
    }
  }
};

var _config = dbConfig.develop;
if (dbConfig.production !== undefined && process.env.NODE_ENV == 'production') {
  _config = dbConfig.production;
}
_config = {client: _config.client, connection: _config[_config.client].connection};

module.exports = _config;
