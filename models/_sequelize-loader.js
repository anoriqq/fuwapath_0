'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost/fuwapath', {operatorsAliases: false, timezone: 'UTC'});

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
