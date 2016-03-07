const config = require('./config').config;

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

const bookshelf = require('bookshelf')(knex);
const ModelBase = require('bookshelf-modelbase')(bookshelf);

bookshelf.plugin(['registry', 'bookshelf-camelcase']);

module.exports.Bookshelf = bookshelf;

module.exports.ModelBase = ModelBase;
