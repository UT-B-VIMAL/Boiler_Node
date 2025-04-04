const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');
const { generateJwtSecret } = require('../utils/randomGenerator');

const JWT_SECRET = process.env.JWT_SECRET || generateJwtSecret();

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return errorResponse(res, 'Access denied. No token provided.', null, 401);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        errorResponse(res, 'Invalid token.', error, 401);
    }
};

module.exports = authMiddleware;
