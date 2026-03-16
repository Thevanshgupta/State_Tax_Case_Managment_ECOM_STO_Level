const router   = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/cases.controller');
const { authenticate, requireRole, requireCaseAccess } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);  // all case routes require auth

// GET /api/cases/stats/summary  — MUST be before /:id
router.get('/stats/summary', ctrl.summary);

// GET /api/cases/history/full
router.get('/history/full', requireRole('admin'), ctrl.fullHistory);

// GET /api/cases
router.get('/', ctrl.list);

// POST /api/cases
router.post('/',
  requireRole('admin', 'edcom'),
  body('taxpayerName').trim().notEmpty().withMessage('Taxpayer name required.'),
  body('gstin').trim().notEmpty().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).withMessage('Invalid GSTIN format.'),
  body('circle').trim().notEmpty().withMessage('Circle required.'),
  body('cgstAmount').optional().isFloat({ min: 0 }).withMessage('CGST must be a positive number.'),
  body('sgstAmount').optional().isFloat({ min: 0 }).withMessage('SGST must be a positive number.'),
  body('cessAmount').optional().isFloat({ min: 0 }).withMessage('CESS must be a positive number.'),
  validate,
  ctrl.create
);

// GET /api/cases/:id
router.get('/:id', requireCaseAccess, ctrl.getById);

// PATCH /api/cases/:id
router.patch('/:id',
  requireCaseAccess,
  body('actionStage').optional().isString(),
  body('lastRemarks').optional().isString(),
  validate,
  ctrl.update
);

// PATCH /api/cases/:id/assign
router.patch('/:id/assign',
  requireRole('admin', 'edcom'),
  body('assignedTo').isInt({ min: 1 }).withMessage('assignedTo must be a valid user ID.'),
  validate,
  ctrl.assign
);

// POST /api/cases/:id/flag
router.post('/:id/flag',
  requireCaseAccess,
  body('reason').trim().notEmpty().withMessage('Flag reason required.'),
  body('remarks').optional().isString(),
  validate,
  ctrl.flagCase
);

// DELETE /api/cases/:id/flag
router.delete('/:id/flag', requireCaseAccess, ctrl.unflagCase);

module.exports = router;