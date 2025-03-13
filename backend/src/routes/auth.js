const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const authController = require('../controllers/auth');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current logged in user
router.get('/me', protect, authController.getMe);

// Logout user / clear cookie
router.get('/logout', authController.logout);

// Update user details
router.put('/updatedetails', protect, authController.updateDetails);

// Update password
router.put('/updatepassword', protect, authController.updatePassword);

// Forgot password
router.post('/forgotpassword', authController.forgotPassword);

// Reset password
router.put('/resetpassword/:resettoken', authController.resetPassword);

module.exports = router; 