const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Closed'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
