'use strict';
const loader = require('./_sequelize-loader');
const Sequelize = loader.Sequelize;

const Event = loader.database.define('events', {
  eventId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false
  },
  statusCode: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false,
  indexes: [{
    fields: ['timestamp']
  }]
});

module.exports = Event;
