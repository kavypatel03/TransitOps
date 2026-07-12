const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route Imports
const authRoutes = require('./routes/authRoutes');

// Root API Route
app.get('/', (req, res) => {
    res.json({ message: "TransitOps API is running perfectly!" });
});

// API Routes
app.use('/', authRoutes);

module.exports = app;