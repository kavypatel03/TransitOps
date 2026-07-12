const mongoose = require('mongoose');

const expenseLogSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    type: {
        type: String,
        enum: ['Fuel', 'Toll', 'Maintenance', 'Other'],
        required: true
    },
    liters: {
        type: Number,
        // Only applicable if type is Fuel
    },
    cost: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('ExpenseLog', expenseLogSchema);
