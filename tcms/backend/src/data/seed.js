const bcrypt = require('bcryptjs');
const store  = require('./store');
const env    = require('../config/env');

const PASSWORDS = {
  'admin@tcms.gov.in': 'admin123',
  'edcom@tcms.gov.in': 'edcom123',
  'sto1@tcms.gov.in':  'sto123',
  'sto2@tcms.gov.in':  'sto123',
  'sto3@tcms.gov.in':  'sto123',
  'sto4@tcms.gov.in':  'sto123',
  'sto5@tcms.gov.in':  'sto123',
};

const seedPasswords = async () => {
  const users = store.users.findAll();
  for (const user of users) {
    const plain = PASSWORDS[user.email];
    if (plain) {
      store.users.update(user.id, {
        passwordHash: await bcrypt.hash(plain, env.BCRYPT_ROUNDS),
      });
    }
  }
  console.log('[Seed] Passwords hashed.');
};

module.exports = { seedPasswords };