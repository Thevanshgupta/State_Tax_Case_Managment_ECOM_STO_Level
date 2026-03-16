const authService = require('../services/auth.service');
const R           = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    return R.ok(res, result);
  } catch (e) { next(e); }
};

const logout = (req, res, next) => {
  try {
    authService.logout(req.user.jti, req.user.id);
    return R.ok(res, { message: 'Logged out successfully.' });
  } catch (e) { next(e); }
};

const me = (req, res, next) => {
  try {
    const user = authService.me(req.user.id);
    return R.ok(res, { user });
  } catch (e) { next(e); }
};

module.exports = { login, logout, me };