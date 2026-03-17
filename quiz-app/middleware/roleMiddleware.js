function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        // This middleware should run after authMiddleware.
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Login required'
            });
        }

        // Only users with the right role can continue.
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        next();
    };
}

module.exports = roleMiddleware;