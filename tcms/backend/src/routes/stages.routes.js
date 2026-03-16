const router   = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/stages.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.use(authenticate);

router.get('/',    ctrl.list);
router.get('/all', requireRole('admin'), ctrl.listAll);

router.post('/',
  requireRole('admin'),
  body('code').trim().notEmpty().withMessage('Stage code required.'),
  body('description').trim().notEmpty().withMessage('Description required.'),
  validate,
  ctrl.create
);

router.put('/:id',
  requireRole('admin'),
  body('description').trim().notEmpty().withMessage('Description required.'),
  validate,
  ctrl.update
);

router.delete('/:id', requireRole('admin'), ctrl.deactivate);

module.exports = router;