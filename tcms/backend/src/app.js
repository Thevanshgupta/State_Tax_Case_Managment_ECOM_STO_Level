const express        = require('express');
const helmet         = require('helmet');
const cors           = require('cors');
const morgan         = require('morgan');
const { body }       = require('express-validator');
const env            = require('./config/env');
const routes         = require('./routes');
const errorHandler   = require('./middleware/errorHandler');
const rateLimiter    = require('./middleware/rateLimiter');
const { authenticate } = require('./middleware/auth');
const { validate }   = require('./middleware/validate');
const authController = require('./controllers/auth.controller');

const app = express();

/* ── Security Headers ─────────────────────────── */
app.use(helmet({ contentSecurityPolicy: false }));

/* ── CORS ─────────────────────────────────────── */
app.use(cors({
  origin: env.ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

/* ── Body Parsing ─────────────────────────────── */
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Request Logging ──────────────────────────── */
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

/* ── Global Rate Limiter ──────────────────────── */
app.use('/api/', rateLimiter.global);

/* ── Health Check ─────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({
    status:    'ok',
    version:   '1.0.0',
    env:       env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime:    `${Math.floor(process.uptime())}s`,
  });
});

/* ── Legacy (non /api) auth routes ───────────────── */
app.post('/login',
  rateLimiter.auth,
  body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
  body('password').notEmpty().withMessage('Password required.'),
  validate,
  authController.login
);

app.post('/logout', authenticate, authController.logout);
app.get('/me', authenticate, authController.me);

/* ── API Routes ───────────────────────────────── */
app.use('/api', routes);

/* ── 404 Handler ──────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found.` });
});

/* ── Global Error Handler ─────────────────────── */
app.use(errorHandler);

module.exports = app;