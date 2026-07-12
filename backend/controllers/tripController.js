const Trip = require('../models/Trip');

const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().populate('vehicle').populate('driver');
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTrips };
