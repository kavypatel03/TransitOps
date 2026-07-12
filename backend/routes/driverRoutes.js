const express = require('express');
const router = express.Router();
const { getDrivers, updateDriver, deleteDriver } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDrivers);
router.route('/:id').put(protect, updateDriver).delete(protect, deleteDriver);

module.exports = router;
