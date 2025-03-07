const Product = require("../../models/product");

class adminController {
  async addProduct(req, res) {
    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      userId: req.user.id
    });
    res.status(201).json({
      message: "Product is added",
      productId: product.id,
    });
  }

  async getAllProducts(req, res) {
    const products = await Product.findAll();
    console.log(products);
    res.status(200).json({
      products: products,
    });
  }

  async getOneProduct(req, res) {
    const productId = req.params.productId;
    const product = await Product.findOne({
      where: { id: productId },
    });
    res.status(200).json({
      message: "Got the product by id",
      product: product,
    });
  }

  async getEditProduct(req, res) {
    const productId = req.params.productId;
    const edit = req.query.edit;
    console.log(edit);
    if (edit === "true") {
      const product = await Product.findOne({
        where: { id: productId },
      });
      res.status(200).json({
        message: "Product data for editing",
        product: product,
      });
    } else {
      res.status(401).json({
        message: "no edit access",
      });
    }
  }

  async updateProduct(req, res) {
    const edit = req.query.edit;

    if (edit === "true") {

      const productId = req.params.productId;
      const product = await Product.findOne({ where: { id: productId } });

      await product.update({
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
      });

      res.status(200).json({
        message: "Product is updated",
        product: product,
      });
    } else {
      res.status(401).json({ message: "No edit access" });
    }
  }
  async deleteProduct(req, res) {
    const deleted = await Product.destroy({
      where: { id: req.params.productId },
    });

    if (deleted) {
      res.status(200).json({ message: "Product is deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  }
}

module.exports = new adminController();
