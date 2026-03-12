const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (require('mongoose').connection.readyState !== 1) {
                // Mock mode: find user in in-memory storage
                const { mockUsers } = require('../controllers/authController');
                const user = mockUsers.find(u => u._id === decoded.id);
                if (user) {
                    req.user = user;
                    next();
                } else {
                    res.status(401).json({ message: 'Mock user session not found' });
                }
            } else {
                const user = await User.findById(decoded.id).select('-password');
                if (!user) {
                    console.error('Auth Failure: User not found in database');
                    return res.status(401).json({ message: 'User not found or session expired' });
                }
                req.user = user;
                next();
            }
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.warn('Auth Failure: No token found in headers');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
