'use strict';

const _ = require('lodash');

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

exports.seed = function(knex, Promise) {
  const mapProperties = function(table) {
    return knex.select('id', 'name').from(table);
  };

  return Promise.all([
    knex.select('*').from('managers'),
    knex.select('*').from('teams')
  ]).spread(function(managers, teams) {
    const brendan = _.find(managers, function(m) {
      return m.name === 'Brendan Rodgers';
    });

    const findTeam = (name) => {
      return _.find(teams, function(t) {
        return t.name === name;
      });
    };

    const findIndex = (arr, k) => {
      for(let i = 0;i < arr.length;i ++) {
        if(arr[i] === k) {
          return i;
        }
      }

      return -1;
    };

    const padNumber = (n) => {
      const number = '0' + n;

      return number.substr(number.length -2);
    };

    const insertResult = (dateString, scored, conceded, result, position, teamName, manager) => {
      const dateParts = dateString.split(' ');

      const day = padNumber(dateParts[0]);
      const month = padNumber(findIndex(months, 'August') + 1);
      const date = `${dateParts[2]}-${month}-${day}T00:00:00`;
      const team_id = findTeam(teamName).id;
      return knex('results').insert({
        time: date,
        scored: 0,
        conceded: 3,
        result: 'l',
        position: position,
        team_id: team_id,
        manager_id: brendan.id
      });
    };

    return Promise.join(
      insertResult('26 August 2012', 0, 3, 'l', 20, 'West Bromwich Albion', brendan.id)
    );
  });
};
