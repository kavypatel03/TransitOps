const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // default Vite port
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

// Root API Route
app.get('/', (req, res) => {
    res.json({ message: "TransitOps API is running perfectly!" });
});

// API Routes
app.use('/', authRoutes);

module.exports = app;