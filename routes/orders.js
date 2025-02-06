const express = require('express');
const router = express.Router();
const { getAllOrders, getSingleOrder, createOrder, updateOrder, deleteOrder } = require('../controllers/orders');
const { validateOrder, validateId } = require('../middleware/validation');
const errorHandler = require('../middleware/errorHandler');
//const { isAuthenticated} = require('../middleware/authenticate');


router.get('/', getAllOrders);
router.get('/:id', getSingleOrder);
router.post('/',validateOrder, createOrder);//put back isAthenticated 
router.put('/:id',validateId,validateOrder,  updateOrder);//put back isAthenticated 
router.delete('/:id',validateId,validateOrder, deleteOrder);//put back isAthenticated 




module.exports = router;
