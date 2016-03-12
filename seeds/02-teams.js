
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('teams').del(),
    knex('teams').insert({name: 'West Bromwich Albion'}),
    knex('teams').insert({name: 'Manchester City'}),
    knex('teams').insert({name: 'Arsenal'}),
    knex('teams').insert({name: 'Sunderland'}),
    knex('teams').insert({name: 'Manchester United'}),
    knex('teams').insert({name: 'Norwich City'}),
    knex('teams').insert({name: 'Stoke City'}),
    knex('teams').insert({name: 'Reading'}),
    knex('teams').insert({name: 'Everton'}),
    knex('teams').insert({name: 'Newcastle United'}),
    knex('teams').insert({name: 'Chelsea'}),
    knex('teams').insert({name: 'Wigan Athletic'}),
    knex('teams').insert({name: 'Swansea City'}),
    knex('teams').insert({name: 'Tottenham Hotspur'}),
    knex('teams').insert({name: 'Southampton'}),
    knex('teams').insert({name: 'West Ham United'}),
    knex('teams').insert({name: 'Aston Villa'}),
    knex('teams').insert({name: 'Fulham'}),
    knex('teams').insert({name: 'Queens Park Rangers'})
  );
};
