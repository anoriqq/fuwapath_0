'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost/express_test', {logging: true, operatorsAliases: false});

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
