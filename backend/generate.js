const fs = require('fs');

const generateController = (modelName, variableName) => `
const ${modelName} = require('../models/${modelName}');

const get${modelName}s = async (req, res) => {
    try {
        const ${variableName}s = await ${modelName}.find()${modelName === 'Trip' ? `.populate('vehicle').populate('driver')` : ''};
        res.status(200).json(${variableName}s);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    get${modelName}s
};
`;

const generateRoute = (modelName, variableName) => `
const express = require('express');
const router = express.Router();
const { get${modelName}s } = require('../controllers/${variableName}Controller');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, get${modelName}s);

module.exports = router;
`;

['Vehicle', 'Driver', 'Trip', 'ExpenseLog', 'MaintenanceLog'].forEach(model => {
    const varName = model.charAt(0).toLowerCase() + model.slice(1);
    fs.writeFileSync('./controllers/' + varName + 'Controller.js', generateController(model, varName).trim());
    fs.writeFileSync('./routes/' + varName + 'Routes.js', generateRoute(model, varName).trim());
});
