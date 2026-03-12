const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// In-memory mock storage for Preview Mode
const mockUsers = [];

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
        console.log('Using Mock Registration (In-Memory)');
        const userExists = mockUsers.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists (Mock)' });
        }
        const newUser = {
            _id: Date.now().toString(),
            name,
            email,
            password, // Note: In mock mode we aren't hashing for simplicity of the preview
            role: role || 'citizen',
            matchPassword: async (p) => p === password
        };
        mockUsers.push(newUser);
        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token: generateToken(newUser._id),
            isMock: true
        });
    }

    // Real DB Logic
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password, role: role || 'citizen' });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (mongoose.connection.readyState !== 1) {
        console.log('Using Mock Login (In-Memory)');
        const user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                isMock: true
            });
        }
        return res.status(401).json({ message: 'Invalid credentials (Mock Mode)' });
    }

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, mockUsers };
