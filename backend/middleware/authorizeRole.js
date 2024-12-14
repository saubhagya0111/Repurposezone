const authorizeRole = (requiredRole) => (req, res, next) => {
    const userRole = req.user.role; // Ensure `req.user` is populated by authentication middleware

    if (userRole !== requiredRole) {
        return res.status(403).json({ message: 'Access denied' });
    }

    next(); // User has the required role, proceed to the route handler
};

module.exports = authorizeRole;
