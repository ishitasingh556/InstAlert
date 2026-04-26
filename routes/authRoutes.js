const express = require('express');
const router = express.Router();
const { registerUser, loginUser, addEmergencyContact, deleteEmergencyContact, updateProfile, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/contacts', protect, addEmergencyContact);
router.delete('/contacts/:id', protect, deleteEmergencyContact);
router.put('/profile', protect, updateProfile);

module.exports = router;
