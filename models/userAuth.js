'use strict';
const loader = require('./_sequelize-loader');
const Sequelize = loader.Sequelize;

const UserAuth = loader.database.define('user_auth', {
  user_id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  login_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  created_at:Sequelize.DATE,
  updated_at:Sequelize.DATE
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UserAuth;
