const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, signup, signin } = require('../controllers/authController');

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email
// @access  Public
router.post('/send-otp', sendOTP);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', verifyOTP);

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/signin
// @desc    Sign in user
// @access  Public
router.post('/signin', signin);

module.exports = router;

