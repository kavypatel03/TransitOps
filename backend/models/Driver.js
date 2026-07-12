const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    licenseCategory: {
        type: String,
        required: true
    },
    licenseExpiryDate: {
        type: Date,
        required: true
    },
    contactNumber: {
        type: String,
        required: [true, 'Please add a contact number'],
        match: [/^\d{10,15}$/, 'Please add a valid contact number']
    },
    safetyScore: {
        type: Number,
        default: 100,
        min: [0, 'Score cannot be less than 0'],
        max: [100, 'Score cannot be more than 100']
    },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
        default: 'Available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
