'use strict';
const loader = require('./_sequelize-loader');
const Sequelize = loader.Sequelize;

const Event = loader.database.define('events', {
  event_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false
  },
  status_code: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
}, {
  freezeTableName: true
});

module.exports = Event;
