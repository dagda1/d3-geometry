
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('results').del(),

    // Inserts seed entries
    knex('results').insert({team_id: // somehow select from teamtable)}
  );
};
