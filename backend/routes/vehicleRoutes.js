const express = require('express');
const router = express.Router();
const { getVehicles } = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getVehicles);

module.exports = router;
