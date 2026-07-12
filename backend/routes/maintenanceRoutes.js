const express = require('express');
const router = express.Router();
const { getMaintenanceLogs } = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMaintenanceLogs);

module.exports = router;
