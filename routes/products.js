const express = require('express');
const router = express.Router();
const { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { validateProduct, validateId } = require('../middleware/validation');
const errorHandler = require('../middleware/errorHandler');
//const { isAuthenticated} = require('../middleware/authenticate');


router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.post('/',validateProduct,isAuthenticated,  createProduct); //Put back isAuthenticated
router.put('/:id',validateId,validateProduct, updateProduct);//Put back isAuthenticated
router.delete('/:id',validateId,validateProduct, deleteProduct);//Put back isAuthenticated



module.exports = router;
