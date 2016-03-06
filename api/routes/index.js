'use strict';

const router = require('koa-router')();

const config = require('../config').config;

router.get('/api/', function* () {
  this.body = [];

  this.status = 200;
});

module.exports = router;
