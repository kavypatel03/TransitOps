const express = require('express');
const router = express.Router();
const { getTrips, createTrip, updateTripStatus } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTrips).post(protect, createTrip);
router.route('/:id').put(protect, updateTripStatus);

module.exports = router;
