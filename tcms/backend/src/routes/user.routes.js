const router   = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/user.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

// GET  /api/users
router.get('/', requireRole('admin', 'edcom'), ctrl.list);

// POST /api/users
router.post('/',
  requireRole('admin'),
  body('name').trim().notEmpty().withMessage('Name required.'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars.'),
  body('role').isIn(['admin', 'edcom', 'sto']).withMessage('Role must be admin, edcom, or sto.'),
  validate,
  ctrl.create
);

// GET  /api/users/:id
router.get('/:id', requireRole('admin', 'edcom'), ctrl.getById);

// PATCH /api/users/:id
router.patch('/:id', requireRole('admin'), ctrl.update);

// PATCH /api/users/:id/password
router.patch('/:id/password',
  requireRole('admin'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password min 6 chars.'),
  validate,
  ctrl.changePassword
);

// GET  /api/users/:id/performance
router.get('/:id/performance', requireRole('admin', 'edcom'), ctrl.performance);

module.exports = router;