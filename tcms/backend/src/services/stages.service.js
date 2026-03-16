const store  = require('../data/store');
const { nowStr } = require('../utils/helpers');

const list    = ()     => ({ stages: store.stages.findActive() });
const listAll = ()     => ({ stages: store.stages.findAll().sort((a,b) => a.displayOrder - b.displayOrder) });

const create = (data, requesterId) => {
  const { code, description, displayOrder = 99, isTerminal = false } = data;
  const codeUpper = code.toUpperCase();

  if (store.stages.findByCode(codeUpper)) {
    throw Object.assign(new Error(`Stage code "${codeUpper}" already exists.`), { status: 409 });
  }

  const stage = store.stages.create({ code: codeUpper, description, displayOrder: parseInt(displayOrder), isTerminal: Boolean(isTerminal), isActive: true });
  _audit(requesterId, 'stage_created', stage.id, codeUpper);
  return { stage, message: 'Stage created.' };
};

const update = (id, data, requesterId) => {
  const s = store.stages.findById(id);
  if (!s) throw Object.assign(new Error('Stage not found.'), { status: 404 });

  const allowed = {};
  if (data.description  !== undefined) allowed.description  = data.description;
  if (data.isTerminal   !== undefined) allowed.isTerminal   = Boolean(data.isTerminal);
  if (data.displayOrder !== undefined) allowed.displayOrder = parseInt(data.displayOrder);

  const updated = store.stages.update(id, allowed);
  _audit(requesterId, 'stage_updated', id, updated.code);
  return { stage: updated, message: 'Stage updated.' };
};

const deactivate = (id, requesterId) => {
  const s = store.stages.findById(id);
  if (!s) throw Object.assign(new Error('Stage not found.'), { status: 404 });

  const inUse = store.cases.findAll().find(c => c.actionStage === s.code && c.status !== 'Completed');
  if (inUse) throw Object.assign(new Error(`Stage "${s.code}" is in use by active cases.`), { status: 422 });

  store.stages.update(id, { isActive: false });
  _audit(requesterId, 'stage_deleted', id, s.code);
  return { message: `Stage "${s.code}" deactivated.` };
};

const _audit = (userId, action, entityId, details) => {
  const u = store.users.findById(userId);
  store.audit.add({ userId, userName: u?.name, action, entityType: 'stage', entityId, details, createdAt: nowStr() });
};

module.exports = { list, listAll, create, update, deactivate };