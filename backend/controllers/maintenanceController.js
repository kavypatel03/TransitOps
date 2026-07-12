const MaintenanceLog = require('../models/MaintenanceLog');

const getMaintenanceLogs = async (req, res) => {
    try {
        const logs = await MaintenanceLog.find().populate('vehicle');
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMaintenanceLogs };
