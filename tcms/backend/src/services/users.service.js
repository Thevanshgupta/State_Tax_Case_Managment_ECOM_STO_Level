const bcrypt  = require('bcryptjs');
const env     = require('../config/env');
const store   = require('../data/store');
const { toDTO } = require('../models/user.model');
const { todayStr, nowStr } = require('../utils/helpers');

const list = (filters = {}) => {
  let users = store.users.findAll();
  const { role, status, circle } = filters;
  if (role)   users = users.filter(u => u.role   === role);
  if (status) users = users.filter(u => u.status === status);
  if (circle) users = users.filter(u => u.circle === circle);
  return { users: users.map(toDTO) };
};

const getById = (id) => {
  const u = store.users.findById(id);
  if (!u) throw Object.assign(new Error('User not found.'), { status: 404 });
  return toDTO(u);
};

const create = async (data, creatorId) => {
  const { name, email, password, role, circle, employeeId } = data;

  if (store.users.findByEmail(email)) {
    throw Object.assign(new Error('Email already registered.'), { status: 409 });
  }
  if (role === 'sto' && !circle) {
    throw Object.assign(new Error('Circle is required for STO officers.'), { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  const all          = store.users.findAll();
  const genId        = `GOI/${role.toUpperCase()}/${new Date().getFullYear()}/${String(all.length + 1).padStart(3, '0')}`;

  const user = store.users.create({
    employeeId:   employeeId || genId,
    name,
    email,
    passwordHash,
    role,
    circle:       role === 'sto' ? circle : null,
    status:       'active',
    createdAt:    todayStr(),
  });

  _audit(creatorId, 'user_created', user.id, `${name} (${role})`);
  return { user: toDTO(user), message: 'User created successfully.' };
};

const update = (id, data, requesterId) => {
  const u = store.users.findById(id);
  if (!u) throw Object.assign(new Error('User not found.'), { status: 404 });

  const allowed = {};
  if (data.name   !== undefined) allowed.name   = data.name;
  if (data.email  !== undefined) allowed.email  = data.email;
  if (data.circle !== undefined) allowed.circle = data.circle;
  if (data.status !== undefined) allowed.status = data.status;

  const updated = store.users.update(id, allowed);
  _audit(requesterId, 'user_updated', id, `${updated.name}`);
  return { user: toDTO(updated), message: 'User updated.' };
};

const changePassword = async (id, newPassword, requesterId) => {
  const u = store.users.findById(id);
  if (!u) throw Object.assign(new Error('User not found.'), { status: 404 });
  const passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);
  store.users.update(id, { passwordHash });
  _audit(requesterId, 'password_changed', id, u.name);
  return { message: 'Password changed successfully.' };
};

const performance = (id) => {
  const u = store.users.findById(id);
  if (!u || u.role !== 'sto') throw Object.assign(new Error('STO officer not found.'), { status: 404 });
  const cases = store.cases.findByUser(id);
  return {
    user:  toDTO(u),
    stats: {
      total:       cases.length,
      pending:     cases.filter(c => c.status === 'Pending').length,
      inProcess:   cases.filter(c => c.status === 'In Process').length,
      completed:   cases.filter(c => c.status === 'Completed').length,
      flagged:     cases.filter(c => c.isFlagged).length,
      totalDemand: cases.reduce((a, c) => a + (c.cgstAmount + c.sgstAmount + c.cessAmount), 0) / 100,
    },
  };
};

const _audit = (userId, action, entityId, details) => {
  const u = store.users.findById(userId);
  store.audit.add({ userId, userName: u?.name, action, entityType: 'user', entityId, details, createdAt: nowStr() });
};

module.exports = { list, getById, create, update, changePassword, performance };