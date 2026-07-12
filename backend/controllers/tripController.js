const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().populate('vehicle').populate('driver');
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTrip = async (req, res) => {
    try {
        const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

        const newTrip = new Trip({
            source,
            destination,
            vehicle: vehicleId,
            driver: driverId,
            cargoWeight,
            plannedDistance,
            status: 'Dispatched'
        });

        await newTrip.save();

        await Vehicle.findByIdAndUpdate(vehicleId, { status: 'On Trip' });
        await Driver.findByIdAndUpdate(driverId, { status: 'On Trip' });

        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTripStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        trip.status = status;
        await trip.save();

        if (status === 'Completed' || status === 'Cancelled') {
            await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
            await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });
        } else if (status === 'Dispatched') {
            await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'On Trip' });
            await Driver.findByIdAndUpdate(trip.driver, { status: 'On Trip' });
        }

        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTrips, createTrip, updateTripStatus };
