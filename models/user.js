'use strict';
const loader = require('./_sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define('users', {
  user_id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  user_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  team_id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  team_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

module.exports = User;
