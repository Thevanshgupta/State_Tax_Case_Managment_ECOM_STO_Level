const router       = require('express').Router();
const authRoutes   = require('./auth.routes');
const casesRoutes  = require('./cases.routes');
const usersRoutes  = require('./user.routes');
const stagesRoutes = require('./stages.routes');
const auditRoutes  = require('./audit.routes');
const { authenticate } = require('../middleware/auth');
const store        = require('../data/store');
const { seedPasswords } = require('../data/seed');
const R            = require('../utils/response');

/* Seed on first import */
seedPasswords().catch(console.error);

router.use('/auth',   authRoutes);
router.use('/cases',  casesRoutes);
router.use('/users',  usersRoutes);
router.use('/stages', stagesRoutes);
router.use('/audit',  auditRoutes);

module.exports = router;