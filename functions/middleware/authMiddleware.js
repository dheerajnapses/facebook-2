const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authToken = req?.cookies?.auth_token;
    if (!authToken) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decoded = jwt.verify(authToken?.accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
