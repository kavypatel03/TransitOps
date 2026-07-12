const Driver = require('../models/Driver');
const User = require('../models/User');

const getDrivers = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['Driver', 'driver'] } });
        const drivers = users.map(u => ({
            _id: u._id,
            name: u.name,
            licenseNumber: `DL-${u.phone?.slice(-4) || '0000'}`,
            licenseCategory: 'Commercial Class A',
            contactNumber: u.phone,
            safetyScore: 100,
            status: 'Available'
        }));
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        const updatedDriver = await Driver.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedDriver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.deleteOne();
        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDrivers, updateDriver, deleteDriver };
