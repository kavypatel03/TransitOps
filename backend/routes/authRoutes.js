const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/UserRegister
// @desc    Register a new user
// @access  Public
router.post('/userRegister', authController.register);

// @route   POST /api/auth/UserLogin
// @desc    Login user & get token
// @access  Public
router.post('/userLogin', authController.login);

// @route   POST /userLogout
// @desc    Logout user & destroy session
// @access  Public
router.post('/userLogout', authController.logout);

module.exports = router;
