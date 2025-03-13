const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const product = require("./product");

class shopController {
  async getAllProducts(req, res) {
    const products = await Product.findAll();
    console.log(products);
    res.status(201).json({
      products: products,
    });
  }

  async getCart(req, res) {
    const userCart = await req.user.getCart();
    console.log(userCart);
    const cartProducts = await userCart.getProducts();
    res.status(201).json({
      products: cartProducts,
    });
  }

  async addToCart(req, res) {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "No Product ID or quantity" });
    }
    console.log("Received productId:", productId);
    console.log("Received quantity:", quantity);

    const userCart = await req.user.getCart();

    const cartProducts = await userCart.getProducts({
      where: { id: productId },
    });
    if (cartProducts.length > 0) {
      let existingProduct = cartProducts[0];
      let newQuantity = (existingProduct.quantity += quantity);
      await existingProduct.save({ quantity: newQuantity });
    } else {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const newCartItem = await userCart.addProduct(product, {
        through: { quantity: quantity },
      });
      return res
        .status(201)
        .json({ message: "Product added to cart", cartItem: newCartItem });
    }
  }

  async removeFromCart(req, res) {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID not found" });
    }
    const userCart = await req.user.getCart();
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const cartProducts = await userCart.getProducts({
      where: { id: productId },
    });

    if (cartProducts.length > 0) {
      await userCart.removeProduct(cartProducts[0]);
      return res.status(200).json({ message: "Product removed from cart" });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  }
}

module.exports = new shopController();
