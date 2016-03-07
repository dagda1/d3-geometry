const Bookshelf = require('../bookshelf').Bookshelf;
const ModelBase = require('../bookshelf').ModelBase;

const Manager = ModelBase.extend({
  tableName: 'users'
});

module.exports = Bookshelf.model('Manager', Manager);