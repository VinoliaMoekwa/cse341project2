const express = require('express');
const router = express.Router();
const passport = require('passport'); 



router.get('/', (req, res) => {
    res.send('Hello world');
});


router.use('/orders', require('./orders'));
router.use('/products', require('./products')); 

    // router.get('/login', passport.authenticate('github'), (req, res) => {});

    // router.get('/logout', function(req, res, next) {
    //     req.logout(function(err) {
    //         if (err) { return next(err); }
    //         res.redirect('/');
    //     });
    // });

module.exports = router;
