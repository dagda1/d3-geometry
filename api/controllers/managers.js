"use strict";

const Manager = require('../models/manager');

exports.getManagers = function *() {
  return Manager.fetchAll();
};
