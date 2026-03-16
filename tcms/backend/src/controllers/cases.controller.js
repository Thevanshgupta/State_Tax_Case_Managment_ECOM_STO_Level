const casesService = require('../services/cases.service');
const R           = require('../utils/response');

const summary = (req, res, next) => {
  try {
    return R.ok(res, casesService.stats(req.user));
  } catch (e) { next(e); }
};

const fullHistory = (req, res, next) => {
  try {
    return R.ok(res, { history: casesService.fullHistory() });
  } catch (e) { next(e); }
};

const list = (req, res, next) => {
  try {
    return R.ok(res, casesService.list(req.user, req.query));
  } catch (e) { next(e); }
};

const create = (req, res, next) => {
  try {
    return R.created(res, casesService.create(req.body, req.user.id));
  } catch (e) { next(e); }
};

const getById = (req, res, next) => {
  try {
    return R.ok(res, casesService.getById(parseInt(req.params.id), req.user));
  } catch (e) { next(e); }
};

const update = (req, res, next) => {
  try {
    return R.ok(res, casesService.update(parseInt(req.params.id), req.body, req.user));
  } catch (e) { next(e); }
};

const assign = (req, res, next) => {
  try {
    return R.ok(res, casesService.assign(parseInt(req.params.id), req.body.assignedTo, req.user.id));
  } catch (e) { next(e); }
};

const flagCase = (req, res, next) => {
  try {
    return R.ok(res, casesService.flag(parseInt(req.params.id), req.body.reason, req.body.remarks, req.user.id));
  } catch (e) { next(e); }
};

const unflagCase = (req, res, next) => {
  try {
    return R.ok(res, casesService.unflag(parseInt(req.params.id), req.user.id));
  } catch (e) { next(e); }
};

module.exports = { summary, fullHistory, list, create, getById, update, assign, flagCase, unflagCase };