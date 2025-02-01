const express = require('express');
const router = express.Router();

// Default Route
router.get('/', (req, res) => {
    //#swagger.tags=['Hello World']
    res.send('Hello world');
});


router.use('/swagger', require('./swagger'));
router.use('/orders', require('./orders'));
router.use('/products', require('./products')); 

module.exports = router;
