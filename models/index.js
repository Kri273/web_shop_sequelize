const path = require('path');
const fs = require('fs');
const sequelize = require('../util/db');
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

  models.User.hasMany(models.Product)
  models.Product.belongsTo(models.User, {constants: true, onDelete: 'CASCADE'})

  return models;
})();