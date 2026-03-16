const env = {
  PORT:            parseInt(process.env.PORT)   || 5000,
  NODE_ENV:        process.env.NODE_ENV         || 'development',
  JWT_SECRET:      process.env.JWT_SECRET       || 'tcms-dev-secret-change-in-production-min32chars',
  JWT_EXPIRES_IN:  process.env.JWT_EXPIRES_IN   || '8h',
  BCRYPT_ROUNDS:   parseInt(process.env.BCRYPT_ROUNDS) || 10,
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',').map(s => s.trim()),
  DATABASE_URL:    process.env.DATABASE_URL     || null,
  USE_DATABASE:    process.env.USE_DATABASE     === 'true',
};

/* Warn in production if secret is default */
if (env.NODE_ENV === 'production' && env.JWT_SECRET.includes('dev-secret')) {
  console.warn('[WARN] JWT_SECRET is using default dev value. Change before production deployment.');
}

module.exports = env;