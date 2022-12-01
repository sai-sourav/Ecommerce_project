const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Cart = sequelize.define('cart', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    productid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    productname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    productimg: {
      type: Sequelize.STRING,
      allowNull: false
    },
    productprice: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
  });
  
  module.exports = Cart;