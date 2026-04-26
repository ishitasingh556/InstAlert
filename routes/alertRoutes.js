const express = require('express');
const router = express.Router();
const { triggerAlert, triggerAlertToContact, resolveAlert, getActiveAlert } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.post('/trigger', protect, triggerAlert);
router.post('/trigger-individual', protect, triggerAlertToContact);
router.put('/:id/resolve', protect, resolveAlert);
router.get('/active', protect, getActiveAlert);

module.exports = router;
