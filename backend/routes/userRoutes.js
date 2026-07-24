const express = require('express');
const router = express.Router();
const { getMe, updateBudget } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Get current user's profile and budget
router.get('/me', protect, getMe);

// Update current user's budget
router.put('/budget', protect, updateBudget);

module.exports = router;
