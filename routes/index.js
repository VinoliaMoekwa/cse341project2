const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hello world');
});


router.use('/orders', require('./orders'));
router.use('/products', require('./products')); 

module.exports = router;
