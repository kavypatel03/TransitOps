const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
    let token;

    // Check for JWT token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next(); // Proceed if JWT is valid
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // Check for Session
    if (req.session && req.session.userId) {
        try {
            req.user = await User.findById(req.session.userId).select('-password');
            if (req.user) {
                return next(); // Proceed if session is valid
            }
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, session failed' });
        }
    }

    // If neither JWT nor Session worked
    if (!token && (!req.session || !req.session.userId)) {
        return res.status(401).json({ message: 'Not authorized, no token or session' });
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
