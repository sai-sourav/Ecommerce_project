const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Cartitem = sequelize.define('cartitem', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
  
  module.exports = Cartitem;

