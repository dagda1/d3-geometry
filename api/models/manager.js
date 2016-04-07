const Bookshelf = require('../bookshelf').Bookshelf;
const ModelBase = require('../bookshelf').ModelBase;

const Manager = ModelBase.extend({
  tableName: 'managers'
});

module.exports = Bookshelf.model('Manager', Manager);
