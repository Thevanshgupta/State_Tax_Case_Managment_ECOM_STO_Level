const stagesService = require('../services/stages.service');
const R             = require('../utils/response');

const list       = (req, res, next) => { try { return R.ok(res, stagesService.list());                                                      } catch(e){ next(e); } };
const listAll    = (req, res, next) => { try { return R.ok(res, stagesService.listAll());                                                   } catch(e){ next(e); } };
const create     = (req, res, next) => { try { return R.created(res, stagesService.create(req.body, req.user.id));                          } catch(e){ next(e); } };
const update     = (req, res, next) => { try { return R.ok(res, stagesService.update(parseInt(req.params.id), req.body, req.user.id));      } catch(e){ next(e); } };
const deactivate = (req, res, next) => { try { return R.ok(res, stagesService.deactivate(parseInt(req.params.id), req.user.id));            } catch(e){ next(e); } };

module.exports = { list, listAll, create, update, deactivate };