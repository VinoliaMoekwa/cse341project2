const express = require('express');
const router = express.Router();
const { getAllOrders, getSingleOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orders');
const { validateOrder, validateId } = require('../middleware/validation');
const { isAuthenticated} = require('../middleware/authenticate');


router.get('/', getAllOrders);
router.get('/:id', getSingleOrder);
router.post('/',validateOrder, isAuthenticated, createOrder);
router.put('/:id',validateId,validateOrder, isAuthenticated, updateOrder);
router.delete('/:id',validateId,validateOrder, isAuthenticated, deleteOrder);




module.exports = router;
