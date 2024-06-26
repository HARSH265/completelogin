const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authenticateToken;
