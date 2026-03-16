const jwt    = require('jsonwebtoken');
const env    = require('../config/env');
const store  = require('../data/store');
const R      = require('../utils/response');

/**
 * authenticate
 * Verifies JWT token from Authorization header.
 * Attaches decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return R.unauthorized(res, 'No token provided. Please login.');
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    // Verify session is still active (not logged out)
    if (!store.sessions.isValid(payload.jti)) {
      return R.unauthorized(res, 'Session expired or revoked. Please login again.');
    }

    req.user = payload; // { id, name, role, circle, employeeId, jti }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return R.unauthorized(res, 'Token expired. Please login again.');
    }
    return R.unauthorized(res, 'Invalid token.');
  }
};

/**
 * requireRole(...roles)
 * Factory — returns middleware that checks user role.
 * Usage: requireRole('admin', 'edcom')
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return R.forbidden(res, `This action requires role: ${roles.join(' or ')}.`);
  }
  next();
};

/**
 * requireCaseAccess
 * For STO users: ensures the case in :id is assigned to them.
 * Admins and EDCOM pass through.
 */
const requireCaseAccess = (req, res, next) => {
  if (req.user.role !== 'sto') return next();

  const caseId = parseInt(req.params.id);
  const c      = store.cases.findById(caseId);

  if (!c) return R.notFound(res, 'Case not found.');
  if (c.assignedTo !== req.user.id) {
    return R.forbidden(res, 'This case is not assigned to you.');
  }
  next();
};

module.exports = { authenticate, requireRole, requireCaseAccess };