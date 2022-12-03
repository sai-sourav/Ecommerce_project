const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  emailid: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  usertype: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "buyer"
  }
});

module.exports = User;