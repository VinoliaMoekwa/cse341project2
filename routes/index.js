// routes/index.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

// A simple hello world route.
router.get('/', (req, res) => {
  res.send('Hello world');
});

// Mount additional routers if available.
router.use('/orders', require('./orders'));
router.use('/products', require('./products'));

// Login route: triggers GitHub authentication.
router.get('/login', passport.authenticate('github'), (req, res) => {
  // This handler won't be reached because Passport redirects to GitHub.
});

// Logout route: logs the user out and clears the session.
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
