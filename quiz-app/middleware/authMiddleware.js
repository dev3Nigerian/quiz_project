const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Read the token from the Authorization header.
    const authHeader = req.headers.authorization;

    // Expect: Authorization: Bearer your_token_here
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token is required'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token and save the user data on the request.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

module.exports = authMiddleware;