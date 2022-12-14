// imports model class and datatypes method
const { Model, DataTypes } = require('sequelize');

// connects to db
const sequelize = require('../config/connection.js');

// creats model
class Category extends Model {}

Category.init(
  {
    // defines columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    // connection to sequelize
    sequelize,
    // doesn't include timestamps with data
    timestamps: false,
    // ensures name is not altered 
    freezeTableName: true,
    // converts camel case to underscored
    underscored: true,
    // sets name of model
    modelName: 'category',
  }
);

module.exports = Category;
