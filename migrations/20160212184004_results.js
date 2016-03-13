exports.up = function(knex, Promise) {
  return knex.schema.createTable('results', function(table){
    table.increments();
    table.datetime('time').notNullable();
    table.integer('scored').notNullable();
    table.integer('conceded').notNullable();
    table.string('result', 1).notNullable();
    table.integer('position').notNullable();
    table.integer('team_id').unsigned().index().references('id').inTable('teams');
    table.string('location', 1).notNullable();
    table.integer('manager_id').unsigned().index().references('id').inTable('managers');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('results');
};
