const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || true, // Allow all or use FRONTEND_URL in production
    credentials: true
}));
app.use(express.json());

// Session Configuration
app.use(session({
    secret: process.env.JWT_SECRET || 'transitops_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Route Imports
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const driverRoutes = require('./routes/driverRoutes');
const tripRoutes = require('./routes/tripRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

// Root API Route
app.get('/', (req, res) => {
    res.json({ message: "TransitOps API is running perfectly!" });
});

// API Routes
app.use('/', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/maintenance', maintenanceRoutes);

module.exports = app;