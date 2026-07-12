const express = require('express');
const router = express.Router();
const { getVehicles, addVehicle, deleteVehicle, updateVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getVehicles).post(protect, addVehicle);
router.route('/:id').delete(protect, deleteVehicle).put(protect, updateVehicle);

module.exports = router;
