'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost/fuwafuwa', {logging: true, operatorsAliases: false, timezone: 'UTC'});

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
