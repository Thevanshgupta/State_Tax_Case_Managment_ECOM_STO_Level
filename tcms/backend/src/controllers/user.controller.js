const usersService = require('../services/users.service');
const R           = require('../utils/response');

const list = (req, res, next) => {
  try {
    return R.ok(res, usersService.list(req.query));
  } catch (e) { next(e); }
};

const create = (req, res, next) => {
  try {
    return R.created(res, usersService.create(req.body, req.user.id));
  } catch (e) { next(e); }
};

const getById = (req, res, next) => {
  try {
    return R.ok(res, { user: usersService.getById(parseInt(req.params.id)) });
  } catch (e) { next(e); }
};

const update = (req, res, next) => {
  try {
    return R.ok(res, { user: usersService.update(parseInt(req.params.id), req.body, req.user.id) });
  } catch (e) { next(e); }
};

const changePassword = (req, res, next) => {
  try {
    return R.ok(res, usersService.changePassword(parseInt(req.params.id), req.body.newPassword, req.user.id));
  } catch (e) { next(e); }
};

const performance = (req, res, next) => {
  try {
    return R.ok(res, usersService.performance(parseInt(req.params.id)));
  } catch (e) { next(e); }
};

module.exports = { list, create, getById, update, changePassword, performance };