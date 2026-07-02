/**
 * Role-Based Access Control Middleware
 * Restricts route access to specified roles
 * Admin always has full access to every route.
 * Must be used AFTER the auth (protect) middleware
 *
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'collector', 'user')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Admin has unrestricted access to all routes
    if (req.user.role === 'admin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

module.exports = authorize;

