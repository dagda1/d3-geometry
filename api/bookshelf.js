import config from 'config';

const knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    database: config.database.database,
    charset: 'utf8'
  },
  migrations: {
    tableName: 'knex_migrations'
  }
});

const bookshelf = require('knex')(knex);

bookshelf.plugin(['registry', 'bookshelf-camelcase']);

module.exports = bookshelf;
