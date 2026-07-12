const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    modelName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    maxLoadCapacity: {
        type: Number,
        required: [true, 'Please add maximum load capacity'],
        min: [0, 'Capacity cannot be negative']
    },
    odometer: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Odometer cannot be negative']
    },
    acquisitionCost: {
        type: Number,
        required: [true, 'Please add acquisition cost'],
        min: [0, 'Cost cannot be negative']
    },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
        default: 'Available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
