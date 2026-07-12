const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const userData = req.body;
        const result = await authService.registerUser(userData);
        req.session.userId = result._id; // Set session
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const result = await authService.loginUser(email, password);
        req.session.userId = result._id; // Set session
        
        if (rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

module.exports = {
    register,
    login,
    logout
};
