const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const Alert = require('../models/Alert');
const { protect } = require('../middleware/authMiddleware');

router.post('/upload', protect, upload.single('evidence'), async (req, res) => {
  try {
    const alertId = req.body.alertId;
    if (!alertId) {
      return res.status(400).json({ message: 'Alert ID is required' });
    }

    const alert = await Alert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    const fileUrl = `/${req.file.path.replace(/\\/g, '/')}`;

    if (req.file.mimetype.startsWith('video/')) {
      alert.videoUrls.push(fileUrl);
    } else if (req.file.mimetype.startsWith('audio/')) {
      alert.audioUrls.push(fileUrl);
    }

    await alert.save();

    res.send({
      message: 'Evidence uploaded successfully',
      fileUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
