'use strict';

const mangersController = require('../controllers/managers');

const router = require('koa-router')();

const config = require('../config').config;

function makeHandler(func) {
  return function* () {
    const model = yield func;

    this.body = model.toJSON();

    this.status = 200;
  };
};

router.get('/api/managers', makeHandler(mangersController.getManagers));

module.exports = router;
