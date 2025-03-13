const path = require('path');
const fs = require('fs');
const sequelize = require('../util/db');
const { PassThrough } = require('stream');
const models = {};

module.exports = (() => {
  if (!Object.keys(models).length) {
    const files = fs.readdirSync(__dirname);
    const excludedFiles = ['.', '..', 'index.js'];

    for (const fileName of files) {
      if (!excludedFiles.includes(fileName) && (path.extname(fileName) === '.js')) {
        const modelFile = require(path.join(__dirname, fileName));
        models[modelFile.getTableName()] = modelFile;
      }
    }

    Object
      .values(models)
      .forEach(model => {
        if (typeof model.associate === 'function') {
          model.associate(models);
        }
      });

    models.sequelize = sequelize;
  }

  models.User = require("./user.js")
  models.Product = require("./product.js")
  models.Cart = require('./cart.js')
  models.CartItem = require('./cart-item.js')

  models.User.hasMany(models.Product)
  models.Product.belongsTo(models.User, {constants: true, onDelete: 'CASCADE'})
  models.User.hasOne(models.Cart)
  models.Cart.belongsTo(models.User)
  models.Cart.belongsToMany(models.Product, {through: models.CartItem})
  models.Product.belongsToMany(models.Cart, {through: models.CartItem})
  
  return models;
})();