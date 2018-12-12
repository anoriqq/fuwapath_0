'use strict';
const loader = require('./_sequelize-loader');
const Sequelize = loader.Sequelize;

const UserStatus = loader.database.define('user_status', {
  status_code: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  created_at:Sequelize.DATE,
  updated_at:Sequelize.DATE,
  deleted_at:Sequelize.DATE
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

module.exports = UserStatus;
