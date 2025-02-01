const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.get('/', ordersController.getAll);
router.get('/:id', ordersController.getSingle);
router.post('/', ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;