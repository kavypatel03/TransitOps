const ExpenseLog = require('../models/ExpenseLog');

const getExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseLog.find().populate('vehicle').populate('driver');
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getExpenses };
