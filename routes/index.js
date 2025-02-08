const express = require('express');
const router = express.Router();
const passport = require('passport');

// A simple hello world route
router.get('/', (req, res) => {
  res.send('Hello world');
});

// Example: Mount orders and products routes if available
router.use('/orders', require('./orders'));
router.use('/products', require('./products'));

// Login route: This will redirect the user to GitHub for authentication.
router.get('/login', passport.authenticate('github'), (req, res) => {
  // This function will not be called because the request is redirected to GitHub.
});

// Logout route: Passport’s logout function clears the login session.
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
