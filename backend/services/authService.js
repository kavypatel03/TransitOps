const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    };
};

const loginUser = async (email, password) => {
    // Check for user email and explicitly select password since it's hidden by default
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Check if password matches using the method we built in User.js
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    };
};

module.exports = {
    registerUser,
    loginUser
};
