const express = require('express');
const router = express.Router();
const { getAllOrders, getSingleOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orders');
const { validateOrder, validateId } = require('../middleware/validation');
const errorHandler = require('../middleware/errorHandler');


router.get('/', getAllOrders);
router.get('/:id', validateId, getSingleOrder);
router.post('/', validateOrder, createOrder);
router.put('/:id', [validateId, validateOrder], updateOrder);
router.delete('/:id', validateId, deleteOrder);


router.use(errorHandler);

module.exports = router;
