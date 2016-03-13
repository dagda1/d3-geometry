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

    const insertResult = (dateString, scored, conceded, result, position, teamName, location, manager) => {
      const dateParts = dateString.split(' ');

      console.log(teamName);

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
        location: location,
        manager_id: brendan.id
      });
    };

    return Promise.join(
      insertResult('18 August 2012', 0, 3, 'l', 18, 'West Bromwich Albion', 'a', brendan.id),
      insertResult('26 August 2012', 2, 2, 'd', 16, 'Manchester City', 'h', brendan.id),
      insertResult('2 September 2012', 0, 2, 'l', 18, 'Arsenal', 'h', brendan.id),
      insertResult('15 September 2012', 1, 1, 'd', 17, 'Sunderland', 'a', brendan.id),
      insertResult('23 September 2012', 1, 2, 'l', 18, 'Manchester United', 'h', brendan.id),
      insertResult('29 September 2012', 5, 2, 'w', 14, 'Norwich City', 'a', brendan.id),
      insertResult('7 October 2012', 0, 0, 'd', 14, 'Stoke City', 'h', brendan.id),
      insertResult('20 October 2012', 1, 0, 'w', 11, 'Reading', 'h', brendan.id),
      insertResult('28 October 2012', 2, 2, 'd', 12, 'Everton', 'a', brendan.id),
      insertResult('4 November 2012', 1, 1, 'd', 12, 'Newcastle United', 'h', brendan.id),
      insertResult('11 November 2012', 1, 1, 'd', 12, 'Chelsea', 'a', brendan.id),
      insertResult('17 November 2012', 3, 0, 'w', 13, 'Wigan Athletic', 'h', brendan.id),
      insertResult('25 November 2012', 0, 0, 'd', 13, 'Swansea City', 'a', brendan.id),
      insertResult('28 November 2012', 1, 2, 'l', 11, 'Tottenham Hotspur', 'a', brendan.id),
      insertResult('1 December 2012', 1, 0, 'w', 11, 'Southampton', 'h', brendan.id),
      insertResult('9 December 2012', 3, 2, 'w', 12, 'West Ham United', 'a', brendan.id),
      insertResult('15 December 2012', 1, 3, 'l', 11, 'Aston Villa', 'h', brendan.id),
      insertResult('22 December 2012', 4, 0, 'w', 10, 'Fulham', 'h', brendan.id),
      insertResult('26 December 2012', 1, 3, 'l', 12, 'Stoke City', 'a', brendan.id),
      insertResult('30 December 2012', 3, 0, 'w', 8, 'Queens Park Rangers', 'a', brendan.id),
      insertResult('2 January 2013', 3, 0, 'w', 10, 'Sunderland', 'h', brendan.id),
      insertResult('13 January 2013', 1, 2, 'l', 9, 'Manchester United', 'a', brendan.id),
      insertResult('19 January 2013', 5, 0, 'w', 8, 'Norwich City', 'h', brendan.id),
      insertResult('30 January 2013', 2, 2, 'd', 8, 'Arsenal', 'h', brendan.id),
      insertResult('11 February 2013', 2, 2, 'd', 7, 'Manchester City', 'a', brendan.id),
      insertResult('17 February 2013', 0, 2, 'l', 7, 'West Bromwich Albion', 'h', brendan.id),
      insertResult('2 March 2013', 4, 0, 'w', 7, 'Wigan Athletic', 'a', brendan.id),
      insertResult('10 March 2013', 3, 2, 'w', 7, 'Tottenham Hotspur', 'h', brendan.id),
      insertResult('16 March 2013', 1, 3, 'l', 9, 'Southampton', 'a', brendan.id),
      insertResult('31 March 2013', 2, 1, 'w', 8, 'Aston Villa', 'a', brendan.id),
      insertResult('7 April 2013', 0, 0, 'd', 7, 'West Ham United', 'h', brendan.id),
      insertResult('13 April 2013', 0, 0, 'd', 6, 'Reading', 'a', brendan.id),
      insertResult('21 April 2013', 2, 2, 'd', 7, 'Chelsea', 'h', brendan.id),
      insertResult('27 April 2013', 6, 0, 'w', 7, 'Newcastle United', 'a', brendan.id),
      insertResult('5 May 2013', 0, 0, 'd', 7, 'Everton', 'h', brendan.id),
      insertResult('12 May 2013', 3, 1, 'w', 7, 'Fulham', 'a', brendan.id),
      insertResult('19 May 2013', 1, 0, 'w', 7, 'Queens Park Rangers', '', brendan.id)//,
      // insertResult('', , , '', 20, '', '', brendan.id),
      // insertResult('', , , '', 20, '', '', brendan.id),
      // insertResult('', , , '', 20, '', '', brendan.id),
      // insertResult('', , , '', 20, '', '', brendan.id),
      // insertResult('', , , '', 20, '', '', brendan.id),
      // insertResult('', , , '', 20, '', '', brendan.id),
      // insertResult('', , , '', 20, '', '', brendan.id),
      // insertResult('', , , '', 20, '', '', brendan.id),
    );
  });
};
