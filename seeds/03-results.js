const _ = require('lodash');

exports.seed = function(knex, Promise) {
  const mapProperties = function(table) {
    return knex.select('id', 'name').from(table)
  };

  return Promise.all([
    knex.select('*').from('managers'),
    knex.select('*').from('teams')
  ]).then(function(res) {
    const managers = res[0];
    const teams = res[1];

    const brendan = _.find(managers, function(m) {
      return m.name === 'Brendan Rodgers';
    });

    const westBrom = _.find(teams, function(t) {
      return t.name === 'West Bromwich Albion';
    });

    return Promise.join(
      knex('results').insert({
        time: '2012-08-18T00:00:00',
        scored: 0,
        conceded: 3,
        result: 'l',
        position: 20,
        team_id: westBrom.id,
        manager_id: brendan.id
      })
    );
  });
};
