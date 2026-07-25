const express = require('express');
const passport = require('passport');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
require('../config/passport');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${frontendUrl}/login`, session: false }),
  AuthController.googleCallback
);

module.exports = router;