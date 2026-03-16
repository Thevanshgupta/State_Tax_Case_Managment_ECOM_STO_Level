const store   = require('../data/store');
const { CIRCLES }      = require('../models/user.model');
const { FLAG_REASONS } = require('../models/case.model');
const { todayStr, nowStr, toPaise, caseNumber, caseTotal, formatCase } = require('../utils/helpers');

/* ── helpers ──────────────────────────────────── */
const allUsers  = () => store.users.findAll();
const fmt       = (c)  => formatCase(c, allUsers());

const assertCase = (id) => {
  const c = store.cases.findById(id);
  if (!c) throw Object.assign(new Error('Case not found.'), { status: 404 });
  return c;
};

/* ── list ─────────────────────────────────────── */
const list = (requester, filters = {}) => {
  let cases = requester.role === 'sto'
    ? store.cases.findByUser(requester.id)
    : store.cases.findAll();

  const { status, circle, stage, flagged, assignedTo, search } = filters;
  if (status)     cases = cases.filter(c => c.status === status);
  if (circle)     cases = cases.filter(c => c.circle === circle);
  if (stage)      cases = cases.filter(c => c.actionStage === stage);
  if (flagged === 'true') cases = cases.filter(c => c.isFlagged);
  if (assignedTo) cases = cases.filter(c => c.assignedTo === parseInt(assignedTo));
  if (search) {
    const q = search.toLowerCase();
    cases = cases.filter(c =>
      c.taxpayerName.toLowerCase().includes(q) ||
      c.caseNumber.toLowerCase().includes(q)   ||
      c.gstin.toLowerCase().includes(q)
    );
  }

  const page     = Math.max(1, parseInt(filters.page)  || 1);
  const pageSize = Math.min(200, parseInt(filters.limit) || 100);
  const total    = cases.length;
  const data     = cases.slice((page - 1) * pageSize, page * pageSize).map(fmt);

  return { cases: data, pagination: { page, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) } };
};

/* ── get single ───────────────────────────────── */
const getById = (id, requester) => {
  const c = assertCase(id);
  if (requester.role === 'sto' && c.assignedTo !== requester.id) {
    throw Object.assign(new Error('This case is not assigned to you.'), { status: 403 });
  }
  const history     = store.history.findByCaseId(id);
  const flagHistory = store.flags.findByCaseId(id);
  return { case: fmt(c), history, flagHistory };
};

/* ── create ───────────────────────────────────── */
const create = (data, creatorId) => {
  const { taxpayerName, gstin, circle, financialYear = '2024-25', cgstAmount, sgstAmount, cessAmount, assignedTo } = data;

  const count   = store.cases.countByFY(financialYear);
  const caseNum = caseNumber(financialYear, count);

  const assignedUser = assignedTo ? store.users.findById(parseInt(assignedTo)) : null;

  const newCase = store.cases.create({
    caseNumber:   caseNum,
    taxpayerName,
    gstin:        gstin.toUpperCase(),
    circle,
    financialYear,
    cgstAmount:   toPaise(cgstAmount  || 0),
    sgstAmount:   toPaise(sgstAmount  || 0),
    cessAmount:   toPaise(cessAmount  || 0),
    actionStage:  null,
    status:       'Pending',
    assignedTo:   assignedUser ? assignedUser.id   : null,
    assignedBy:   assignedUser ? creatorId         : null,
    assignedAt:   assignedUser ? todayStr()        : null,
    isFlagged:    false,
    lastRemarks:  '',
    createdBy:    creatorId,
    createdAt:    todayStr(),
    updatedAt:    todayStr(),
  });

  const creator = store.users.findById(creatorId);
  store.history.add({ caseId: newCase.id, userId: creatorId, userName: creator?.name, actionType: 'created', oldValue: null, newValue: null, remarks: 'Case registered', createdAt: nowStr() });

  if (assignedUser) {
    store.history.add({ caseId: newCase.id, userId: creatorId, userName: creator?.name, actionType: 'assigned', oldValue: null, newValue: assignedUser.name, remarks: `${circle} assignment`, createdAt: nowStr() });
    _auditLog(creatorId, 'case_created', newCase.id, `${caseNum} → assigned to ${assignedUser.name}`);
  } else {
    _auditLog(creatorId, 'case_created', newCase.id, caseNum);
  }

  return { case: fmt(newCase) };
};

/* ── update (stage / remarks / status) ───────── */
const update = (id, data, requester) => {
  const c = assertCase(id);
  if (requester.role === 'sto' && c.assignedTo !== requester.id) {
    throw Object.assign(new Error('This case is not assigned to you.'), { status: 403 });
  }
  if (c.status === 'Completed' && requester.role === 'sto') {
    throw Object.assign(new Error('Completed cases cannot be modified.'), { status: 422 });
  }

  const { actionStage, lastRemarks, status } = data;

  if (actionStage !== undefined) {
    const stage = store.stages.findByCode(actionStage);
    if (!stage || !stage.isActive) {
      throw Object.assign(new Error('Invalid or inactive action stage.'), { status: 400 });
    }
    const oldStage = c.actionStage;
    const newStatus = stage.isTerminal ? 'Completed' : 'In Process';
    store.cases.update(id, { actionStage, status: newStatus, updatedAt: todayStr() });
    store.history.add({ caseId: id, userId: requester.id, userName: requester.name, actionType: 'stage_updated', oldValue: oldStage, newValue: actionStage, remarks: lastRemarks || '', createdAt: nowStr() });
    if (stage.isTerminal) {
      store.history.add({ caseId: id, userId: requester.id, userName: requester.name, actionType: 'status_changed', oldValue: 'In Process', newValue: 'Completed', remarks: 'Terminal stage reached', createdAt: nowStr() });
    }
  }

  if (lastRemarks !== undefined) {
    store.cases.update(id, { lastRemarks, updatedAt: todayStr() });
    if (actionStage === undefined) {
      store.history.add({ caseId: id, userId: requester.id, userName: requester.name, actionType: 'remarks_added', oldValue: null, newValue: null, remarks: lastRemarks, createdAt: nowStr() });
    }
  }

  if (status !== undefined && requester.role === 'admin') {
    const oldStatus = c.status;
    store.cases.update(id, { status, updatedAt: todayStr() });
    store.history.add({ caseId: id, userId: requester.id, userName: requester.name, actionType: 'status_changed', oldValue: oldStatus, newValue: status, remarks: 'Admin override', createdAt: nowStr() });
  }

  _auditLog(requester.id, 'case_updated', id, `Case ${c.caseNumber}`);
  return { case: fmt(store.cases.findById(id)) };
};

/* ── assign ───────────────────────────────────── */
const assign = (id, assignedTo, requesterId) => {
  const c      = assertCase(id);
  const toUser = store.users.findById(parseInt(assignedTo));
  if (!toUser || toUser.role !== 'sto') {
    throw Object.assign(new Error('STO officer not found or invalid role.'), { status: 400 });
  }
  const oldAssignee = c.assignedTo;
  store.cases.update(id, { assignedTo: toUser.id, assignedBy: requesterId, assignedAt: todayStr(), status: 'Pending', updatedAt: todayStr() });

  const requester = store.users.findById(requesterId);
  store.history.add({ caseId: id, userId: requesterId, userName: requester?.name, actionType: 'assigned', oldValue: oldAssignee ? String(oldAssignee) : null, newValue: toUser.name, remarks: `Assigned to ${toUser.name}`, createdAt: nowStr() });
  _auditLog(requesterId, 'case_assigned', id, `→ ${toUser.name}`);

  return { case: fmt(store.cases.findById(id)), message: `Case assigned to ${toUser.name}.` };
};

/* ── flag ─────────────────────────────────────── */
const flag = (id, reason, remarks, requesterId) => {
  const c = assertCase(id);
  if (c.isFlagged) throw Object.assign(new Error('Case is already flagged.'), { status: 409 });

  store.cases.update(id, { isFlagged: true, updatedAt: todayStr() });

  const requester = store.users.findById(requesterId);
  store.flags.add({ caseId: id, flaggedBy: requesterId, flaggedByName: requester?.name, reason, remarks: remarks || '', isActive: true, flaggedAt: todayStr(), removedAt: null, removedBy: null });
  store.history.add({ caseId: id, userId: requesterId, userName: requester?.name, actionType: 'flagged', oldValue: null, newValue: reason, remarks: remarks || '', createdAt: nowStr() });
  _auditLog(requesterId, 'case_flagged', id, reason);

  return { message: 'Case flagged successfully.' };
};

/* ── unflag ───────────────────────────────────── */
const unflag = (id, requesterId) => {
  const c = assertCase(id);
  if (!c.isFlagged) throw Object.assign(new Error('Case is not flagged.'), { status: 400 });

  store.cases.update(id, { isFlagged: false, updatedAt: todayStr() });

  const activeFlag = store.flags.findActiveByCase(id);
  if (activeFlag) store.flags.deactivate(activeFlag.id, { isActive: false, removedAt: todayStr(), removedBy: requesterId });

  const requester = store.users.findById(requesterId);
  store.history.add({ caseId: id, userId: requesterId, userName: requester?.name, actionType: 'unflagged', oldValue: null, newValue: null, remarks: 'Flag removed', createdAt: nowStr() });
  _auditLog(requesterId, 'case_unflagged', id, c.caseNumber);

  return { message: 'Flag removed successfully.' };
};

/* ── stats / KPIs ─────────────────────────────── */
const stats = (requester) => {
  const scope = requester.role === 'sto'
    ? store.cases.findByUser(requester.id)
    : store.cases.findAll();

  const all = store.cases.findAll();

  const byCircle = CIRCLES.map(circ => ({
    circle:    circ,
    total:     scope.filter(c => c.circle === circ).length,
    pending:   scope.filter(c => c.circle === circ && c.status === 'Pending').length,
    inProcess: scope.filter(c => c.circle === circ && c.status === 'In Process').length,
    completed: scope.filter(c => c.circle === circ && c.status === 'Completed').length,
    amount:    scope.filter(c => c.circle === circ).reduce((a, c) => a + caseTotal(c), 0) / 100,
  }));

  const activeStages = store.stages.findActive();
  const byStage = activeStages.map(s => ({
    stage:       s.code,
    description: s.description,
    count:       scope.filter(c => c.actionStage === s.code).length,
  })).filter(x => x.count > 0);

  let stoPerformance = null;
  if (requester.role !== 'sto') {
    stoPerformance = store.users.findAll()
      .filter(u => u.role === 'sto')
      .map(u => ({
        id:          u.id,
        name:        u.name,
        circle:      u.circle,
        assigned:    all.filter(c => c.assignedTo === u.id).length,
        pending:     all.filter(c => c.assignedTo === u.id && c.status === 'Pending').length,
        inProcess:   all.filter(c => c.assignedTo === u.id && c.status === 'In Process').length,
        completed:   all.filter(c => c.assignedTo === u.id && c.status === 'Completed').length,
        flagged:     all.filter(c => c.assignedTo === u.id && c.isFlagged).length,
        totalDemand: all.filter(c => c.assignedTo === u.id).reduce((a, c) => a + caseTotal(c), 0) / 100,
      }));
  }

  return {
    totalCases:  scope.length,
    pending:     scope.filter(c => c.status === 'Pending').length,
    inProcess:   scope.filter(c => c.status === 'In Process').length,
    completed:   scope.filter(c => c.status === 'Completed').length,
    flagged:     scope.filter(c => c.isFlagged).length,
    totalCgst:   scope.reduce((a, c) => a + c.cgstAmount, 0) / 100,
    totalSgst:   scope.reduce((a, c) => a + c.sgstAmount, 0) / 100,
    totalCess:   scope.reduce((a, c) => a + c.cessAmount, 0) / 100,
    totalAmount: scope.reduce((a, c) => a + caseTotal(c), 0) / 100,
    byCircle,
    byStage,
    stoPerformance,
  };
};

/* ── audit full history ───────────────────────── */
const fullHistory = () => {
  const all = store.history.findAll();
  return all.map(h => {
    const c = store.cases.findById(h.caseId);
    return { ...h, caseNumber: c?.caseNumber, taxpayerName: c?.taxpayerName };
  });
};

/* ── private ──────────────────────────────────── */
const _auditLog = (userId, action, caseId, details) => {
  const u = store.users.findById(userId);
  store.audit.add({ userId, userName: u?.name, action, entityType: 'case', entityId: caseId, details, createdAt: nowStr() });
};

module.exports = { list, getById, create, update, assign, flag, unflag, stats, fullHistory };