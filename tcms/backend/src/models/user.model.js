/**
 * User Model — validation rules + safe output shape.
 * The actual data access is in services/users.service.js
 */

const ROLES   = ['admin', 'edcom', 'sto'];
const STATUSES = ['active', 'inactive'];
const CIRCLES = [
  'Circle-I (North)',
  'Circle-II (South)',
  'Circle-III (East)',
  'Circle-IV (West)',
  'Circle-V (Central)',
];

const schema = {
  id:           Number,
  employeeId:   String,
  name:         String,
  email:        String,
  passwordHash: String,   // never sent to client
  role:         String,   // one of ROLES
  circle:       String,   // null for admin/edcom
  status:       String,   // one of STATUSES
  createdAt:    String,
};

/**
 * Strip sensitive fields before sending to client
 */
const toDTO = (user) => {
  if (!user) return null;
  const { passwordHash, ...dto } = user;
  return dto;
};

module.exports = { ROLES, STATUSES, CIRCLES, schema, toDTO };