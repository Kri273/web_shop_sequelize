const Product = require('../models/product')

class productController {

    async getAllProducts(req, res) {
        const products = await Product.findAll()
        console.log(products)
        res.status(201).json({
            products: products
        })
    }
    
    async getOneProduct(req, res) {
        const productId = req.params.productId;
        const product = await Product.findOne(
            {
                where: { id: productId}
            })
        res.status(201).json({
            message: 'Got the product by id',
            product: product
        })

    }
}

module.exports = new productController()