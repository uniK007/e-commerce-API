function requireRole(role) {
    return (req, res, next) => {
        // Assuming the user role is stored in req.user.role
        const userRole = req.user.role;

        if (userRole !== role) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Continue with the next middleware or route handler
        next();
    };
}

module.exports = requireRole;