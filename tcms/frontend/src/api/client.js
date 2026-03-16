import { MOCK_USERS, MOCK_STAGES, MOCK_CASES, MOCK_HISTORY, MOCK_FLAGS, MOCK_CREDENTIALS } from '../mock/data.js';
import { CIRCLES } from '../constants/index.js';

/* mutable clones */
let users   = MOCK_USERS.map(u => ({ ...u }));
let stages  = MOCK_STAGES.map(s => ({ ...s }));
let cases   = MOCK_CASES.map(c => ({ ...c }));
const history = { ...MOCK_HISTORY };
const flags   = { ...MOCK_FLAGS };

let counters = { cases: 11, users: 8, stages: 10 };
const nextId = (k) => counters[k]++;

const today = () => new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

/* ── AUTH ──────────────────────────────────────── */
export const mockLogin = (email, password) => {
  if (MOCK_CREDENTIALS[email] !== password) throw new Error('Invalid email or password.');
  const user = users.find(u => u.email === email);
  if (!user)                throw new Error('User not found.');
  if (user.status !== 'active') throw new Error('Account is deactivated.');
  return { token: `mock-${user.id}-${Date.now()}`, expiresIn: '8h', user: { ...user } };
};

/* ── CASES ─────────────────────────────────────── */
export const getCases = (requester, filters = {}) => {
  let result = requester.role === 'sto'
    ? cases.filter(c => c.assignedTo === requester.id)
    : [...cases];

  if (filters.status)   result = result.filter(c => c.status === filters.status);
  if (filters.circle)   result = result.filter(c => c.circle === filters.circle);
  if (filters.stage)    result = result.filter(c => c.actionStage === filters.stage);
  if (filters.flagged === 'true') result = result.filter(c => c.isFlagged);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(c =>
      c.taxpayerName.toLowerCase().includes(q) ||
      c.caseNumber.toLowerCase().includes(q)   ||
      c.gstin.toLowerCase().includes(q)
    );
  }
  return { cases: result, pagination: { page: 1, limit: 100, total: result.length, totalPages: 1 } };
};

export const getCaseById = (id, requester) => {
  const c = cases.find(x => x.id === id);
  if (!c) throw new Error('Case not found.');
  if (requester.role === 'sto' && c.assignedTo !== requester.id) throw new Error('Not your case.');
  return { case: c, history: history[id] || [], flagHistory: flags[id] || [] };
};

export const createCase = (data, creatorId) => {
  const creator   = users.find(u => u.id === creatorId);
  const assignedUser = data.assignedTo ? users.find(u => u.id === Number(data.assignedTo)) : null;
  const count     = cases.filter(c => c.financialYear === (data.financialYear || '2024-25')).length;
  const caseNum   = `CASE/${data.financialYear || '2024-25'}/${String(count + 1).padStart(4, '0')}`;
  const id        = nextId('cases');

  const newCase = {
    id, caseNumber: caseNum,
    taxpayerName: data.taxpayerName,
    gstin:        data.gstin.toUpperCase(),
    circle:       data.circle,
    financialYear: data.financialYear || '2024-25',
    cgst:  Number(data.cgstAmount) || 0,
    sgst:  Number(data.sgstAmount) || 0,
    cess:  Number(data.cessAmount) || 0,
    total: (Number(data.cgstAmount)||0) + (Number(data.sgstAmount)||0) + (Number(data.cessAmount)||0),
    actionStage:    null,
    status:         'Pending',
    isFlagged:      false,
    lastRemarks:    '',
    assignedTo:     assignedUser?.id   || null,
    assignedToName: assignedUser?.name || null,
    createdAt:      today(),
    updatedAt:      today(),
  };
  cases.push(newCase);
  history[id] = [
    { id: Date.now(), userId: creatorId, userName: creator?.name, actionType: 'created',  newValue: null,              remarks: 'Case registered', createdAt: today() },
    ...(assignedUser ? [{ id: Date.now()+1, userId: creatorId, userName: creator?.name, actionType: 'assigned', newValue: assignedUser.name, remarks: `${data.circle} assignment`, createdAt: today() }] : []),
  ];
  return { case: newCase };
};

export const updateCase = (id, data, requester) => {
  const idx = cases.findIndex(c => c.id === id);
  if (idx < 0) throw new Error('Case not found.');
  const c = cases[idx];

  if (data.actionStage !== undefined) {
    const stage = stages.find(s => s.code === data.actionStage);
    const newStatus = stage?.isTerminal ? 'Completed' : 'In Process';
    cases[idx] = { ...c, actionStage: data.actionStage, status: newStatus, updatedAt: today() };
    if (!history[id]) history[id] = [];
    history[id].push({ id: Date.now(), userId: requester.id, userName: requester.name, actionType: 'stage_updated', newValue: data.actionStage, remarks: data.lastRemarks || '', createdAt: today() });
  }
  if (data.lastRemarks !== undefined) {
    cases[idx] = { ...cases[idx], lastRemarks: data.lastRemarks, updatedAt: today() };
  }
  return { case: cases[idx] };
};

export const assignCase = (id, assignedTo, requesterId) => {
  const idx    = cases.findIndex(c => c.id === id);
  if (idx < 0) throw new Error('Case not found.');
  const toUser = users.find(u => u.id === Number(assignedTo));
  if (!toUser) throw new Error('User not found.');
  const requester = users.find(u => u.id === requesterId);

  cases[idx] = { ...cases[idx], assignedTo: toUser.id, assignedToName: toUser.name, status: 'Pending', updatedAt: today() };
  if (!history[id]) history[id] = [];
  history[id].push({ id: Date.now(), userId: requesterId, userName: requester?.name, actionType: 'assigned', newValue: toUser.name, remarks: `Assigned to ${toUser.name}`, createdAt: today() });
  return { case: cases[idx], message: `Assigned to ${toUser.name}.` };
};

export const flagCase = (id, reason, remarks, requesterId) => {
  const idx = cases.findIndex(c => c.id === id);
  if (idx < 0) throw new Error('Case not found.');
  if (cases[idx].isFlagged) throw new Error('Already flagged.');
  const requester = users.find(u => u.id === requesterId);

  cases[idx] = { ...cases[idx], isFlagged: true, updatedAt: today() };
  if (!flags[id])   flags[id]   = [];
  if (!history[id]) history[id] = [];
  flags[id].push({ id: Date.now(), flaggedBy: requesterId, flaggedByName: requester?.name, reason, remarks: remarks || '', isActive: true, flaggedAt: today() });
  history[id].push({ id: Date.now(), userId: requesterId, userName: requester?.name, actionType: 'flagged', newValue: reason, remarks: remarks || '', createdAt: today() });
  return { message: 'Case flagged.' };
};

export const unflagCase = (id, requesterId) => {
  const idx = cases.findIndex(c => c.id === id);
  if (idx < 0) throw new Error('Case not found.');
  const requester = users.find(u => u.id === requesterId);

  cases[idx] = { ...cases[idx], isFlagged: false, updatedAt: today() };
  if (flags[id]) flags[id].forEach(f => (f.isActive = false));
  if (!history[id]) history[id] = [];
  history[id].push({ id: Date.now(), userId: requesterId, userName: requester?.name, actionType: 'unflagged', newValue: null, remarks: 'Flag removed', createdAt: today() });
  return { message: 'Flag removed.' };
};

export const getStats = (requester) => {
  const scope = requester.role === 'sto' ? cases.filter(c => c.assignedTo === requester.id) : [...cases];
  const byCircle = CIRCLES.map(circ => ({
    circle: circ,
    total:     scope.filter(c => c.circle === circ).length,
    pending:   scope.filter(c => c.circle === circ && c.status === 'Pending').length,
    inProcess: scope.filter(c => c.circle === circ && c.status === 'In Process').length,
    completed: scope.filter(c => c.circle === circ && c.status === 'Completed').length,
    amount:    scope.filter(c => c.circle === circ).reduce((a, c) => a + c.total, 0),
  }));
  const stoPerformance = requester.role !== 'sto'
    ? users.filter(u => u.role === 'sto').map(u => ({
        id: u.id, name: u.name, circle: u.circle,
        assigned:  cases.filter(c => c.assignedTo === u.id).length,
        pending:   cases.filter(c => c.assignedTo === u.id && c.status === 'Pending').length,
        inProcess: cases.filter(c => c.assignedTo === u.id && c.status === 'In Process').length,
        completed: cases.filter(c => c.assignedTo === u.id && c.status === 'Completed').length,
        flagged:   cases.filter(c => c.assignedTo === u.id && c.isFlagged).length,
        totalDemand: cases.filter(c => c.assignedTo === u.id).reduce((a, c) => a + c.total, 0),
      }))
    : null;

  const activeStages = stages.filter(s => s.isActive);
  const byStage = activeStages.map(s => ({
    stage: s.code, description: s.description,
    count: scope.filter(c => c.actionStage === s.code).length,
  })).filter(x => x.count > 0);

  return {
    totalCases:  scope.length,
    pending:     scope.filter(c => c.status === 'Pending').length,
    inProcess:   scope.filter(c => c.status === 'In Process').length,
    completed:   scope.filter(c => c.status === 'Completed').length,
    flagged:     scope.filter(c => c.isFlagged).length,
    totalCgst:   scope.reduce((a, c) => a + c.cgst,  0),
    totalSgst:   scope.reduce((a, c) => a + c.sgst,  0),
    totalCess:   scope.reduce((a, c) => a + c.cess,  0),
    totalAmount: scope.reduce((a, c) => a + c.total, 0),
    byCircle, byStage, stoPerformance,
  };
};

export const getFullHistory = () => {
  const all = [];
  Object.entries(history).forEach(([caseId, entries]) => {
    const c = cases.find(x => x.id === Number(caseId));
    entries.forEach(h => all.push({ ...h, caseNumber: c?.caseNumber, taxpayerName: c?.taxpayerName }));
  });
  return all.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
};

/* ── USERS ─────────────────────────────────────── */
export const getUsers = (filters = {}) => {
  let result = [...users];
  if (filters.role)   result = result.filter(u => u.role   === filters.role);
  if (filters.status) result = result.filter(u => u.status === filters.status);
  if (filters.circle) result = result.filter(u => u.circle === filters.circle);
  return { users: result };
};

export const createUser = (data) => {
  if (users.find(u => u.email === data.email)) throw new Error('Email already exists.');
  const newUser = {
    id:         nextId('users'),
    employeeId: data.employeeId || `GOI/${data.role.toUpperCase()}/${new Date().getFullYear()}/${String(users.length + 1).padStart(3, '0')}`,
    name:       data.name,
    email:      data.email,
    role:       data.role,
    circle:     data.role === 'sto' ? data.circle : null,
    status:     'active',
  };
  users.push(newUser);
  return { user: newUser };
};

export const updateUser = (id, data) => {
  const idx = users.findIndex(u => u.id === id);
  if (idx < 0) throw new Error('User not found.');
  users[idx] = { ...users[idx], ...data };
  return { user: users[idx] };
};

/* ── STAGES ────────────────────────────────────── */
export const getStages    = ()         => ({ stages: stages.filter(s => s.isActive).sort((a,b) => a.displayOrder - b.displayOrder) });
export const getAllStages  = ()         => ({ stages: [...stages].sort((a,b) => a.displayOrder - b.displayOrder) });

export const createStage = (data) => {
  const code = data.code.toUpperCase();
  if (stages.find(s => s.code === code)) throw new Error(`Stage "${code}" already exists.`);
  const s = { id: nextId('stages'), code, description: data.description, displayOrder: data.displayOrder || 99, isTerminal: Boolean(data.isTerminal), isActive: true };
  stages.push(s);
  return { stage: s };
};

export const updateStage = (id, data) => {
  const idx = stages.findIndex(s => s.id === id);
  if (idx < 0) throw new Error('Stage not found.');
  stages[idx] = { ...stages[idx], ...data };
  return { stage: stages[idx] };
};

export const deactivateStage = (id) => {
  const s   = stages.find(x => x.id === id);
  if (!s) throw new Error('Stage not found.');
  const inUse = cases.find(c => c.actionStage === s.code && c.status !== 'Completed');
  if (inUse) throw new Error(`Stage "${s.code}" is in use by active cases.`);
  const idx = stages.findIndex(x => x.id === id);
  stages[idx].isActive = false;
  return { message: `Stage "${s.code}" deactivated.` };
};