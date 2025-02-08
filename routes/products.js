const express = require('express');
const router = express.Router();
const { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { validateProduct, validateId } = require('../middleware/validation');
const errorHandler = require('../middleware/errorHandler');
const { isAuthenticated} = require('../middleware/authenticate');


router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.post('/',validateProduct, isAuthenticated, createProduct); 
router.put('/:id',validateId,validateProduct, isAuthenticated, updateProduct);
router.delete('/:id',validateId,validateProduct, isAuthenticated, deleteProduct);



module.exports = router;
