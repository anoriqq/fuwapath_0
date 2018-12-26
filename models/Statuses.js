'use strict';
const loader = require('./_sequelize-loader');
const Sequelize = loader.Sequelize;

const Statuses = loader.database.define('statuses', {
  status_code: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  status_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = Statuses;
