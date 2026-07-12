const express = require('express');
const router = express.Router();
const { getDrivers } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDrivers);

module.exports = router;
