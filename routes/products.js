const express = require('express');
const router = express.Router();
const { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { validateProduct, validateId } = require('../middleware/validation');
const errorHandler = require('../middleware/errorHandler');


router.get('/', getAllProducts);
router.get('/:id', validateId, getSingleProduct);
router.post('/', validateProduct, createProduct);
router.put('/:id', [validateId, validateProduct], updateProduct);
router.delete('/:id', validateId, deleteProduct);


router.use(errorHandler);

module.exports = router;
