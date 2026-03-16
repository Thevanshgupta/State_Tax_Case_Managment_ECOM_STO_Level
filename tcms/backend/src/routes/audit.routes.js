const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const store = require('../data/store');

router.use(authenticate);

router.get('/', requireRole('admin'), (req, res) => {
  res.json({ audit: store.audit.findAll() });
});

module.exports = router;
