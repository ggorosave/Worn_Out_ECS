// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// creates a one to many relationship between category and products. hasMany works with belongsTo below
Category.hasMany(Product, {
  foreignKey: 'category_id',
})

Product.belongsTo(Category, {
  foreignKey: 'category_id',
})

// Creates a many-to-many relationship. two belongsToMany methods needed to establish relationship
Product.belongsToMany(Tag, {
  // ProductTag is the table that connects the Tag table and the Product table
  through: {
    model: ProductTag,
    unique: false,
  },
})

Tag.belongsToMany(Product, {
  // ProductTag is the table that connects the Tag table and the Product table
  through: {
    model: ProductTag,
    unique: false,
  },
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
