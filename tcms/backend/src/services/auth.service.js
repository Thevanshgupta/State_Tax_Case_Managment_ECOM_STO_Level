const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const env    = require('../config/env');
const store  = require('../data/store');
const { toDTO } = require('../models/user.model');
const { nowStr } = require('../utils/helpers');

/**
 * Validate credentials and issue JWT.
 */
const login = async (email, password) => {
  const user = store.users.findByEmail(email);
  if (!user)                throw Object.assign(new Error('Invalid email or password.'), { status: 401 });
  if (user.status !== 'active') throw Object.assign(new Error('Account is deactivated. Contact administrator.'), { status: 401 });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error('Invalid email or password.'), { status: 401 });

  const jti        = `${user.id}-${Date.now()}`;
  const expiresAt  = new Date(Date.now() + 8 * 60 * 60 * 1000);

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role, circle: user.circle, employeeId: user.employeeId, jti },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  store.sessions.add({ jti, userId: user.id, expiresAt: expiresAt.toISOString(), revoked: false, createdAt: nowStr() });
  store.audit.add({ userId: user.id, userName: user.name, action: 'login', entityType: 'user', entityId: user.id, details: 'Login', createdAt: nowStr() });

  return { token, expiresIn: env.JWT_EXPIRES_IN, user: toDTO(user) };
};

/**
 * Revoke session.
 */
const logout = (jti, userId) => {
  store.sessions.revoke(jti);
  const user = store.users.findById(userId);
  store.audit.add({ userId, userName: user?.name || '', action: 'logout', entityType: 'user', entityId: userId, details: '', createdAt: nowStr() });
};

/**
 * Get current user profile.
 */
const me = (userId) => {
  const user = store.users.findById(userId);
  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
  return toDTO(user);
};

module.exports = { login, logout, me };