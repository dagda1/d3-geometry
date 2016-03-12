exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('managers').insert({name: 'Jürgen Klopp', start_date: '2015-10-17T00:00:00'}),
    knex('managers').insert({name: 'Brendan Rodgers', start_date: '2013-09-18T00:00:00', end_date: '2015-10-17T00:00:00'})
  );
};
