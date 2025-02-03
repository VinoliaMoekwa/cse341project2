const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getSingleProduct);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;