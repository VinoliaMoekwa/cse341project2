const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');

router.get('/', productsController.getAll);
router.get('/:id', productsController.getSingle);
router.post('/', productsController.createContact);
router.put('/:id', productsController.updateContact);
router.delete('/:id', productsController.deleteContact);

module.exports = router;