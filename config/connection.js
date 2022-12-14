// imports dotenv so we can use .env files for sensitive information
require('dotenv').config();

// imports sequelize
const Sequelize = require('sequelize');

// checks if connect to heroku jawsdb and uses local host if not
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
  });

// exports connectiongit 
module.exports = sequelize;
