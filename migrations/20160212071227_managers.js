'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('managers', function(table){
    table.increments();
    table.string('name').notNullable();
    table.datetime('start_date');
    table.datetime('end_date');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('managers');
};
