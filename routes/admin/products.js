const express = require('express')
const router = express.Router()
const productController = require('../../controllers/admin/product')

router.post('/product/add', (req, res) => productController.addProduct(req, res))

router.get('/products', (req, res) => productController.getAllProducts(req, res))
router.get('/product/:productId',(req, res) => productController.getOneProduct(req, res))

router.get('/product/edit/:productId', (req, res) => productController.getEditProduct(req, res));
router.put('/product/:productId', (req, res) => productController.updateProduct(req, res));

router.delete('/product/delete/:productId',(req, res) => productController.deleteProduct(req, res))

module.exports = router