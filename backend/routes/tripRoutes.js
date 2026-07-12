const express = require('express');
const router = express.Router();
const { getTrips } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTrips);

module.exports = router;
