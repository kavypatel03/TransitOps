const Driver = require('../models/Driver');

const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDrivers };
