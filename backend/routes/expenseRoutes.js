const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// We apply the protect middleware to ALL routes in this file at once
router.use(protect);

router.route('/')
  .get(getExpenses) // Handles GET /api/expenses
  .post(addExpense); // Handles POST /api/expenses

router.route('/:id')
  .put(updateExpense) // Handles PUT /api/expenses/:id
  .delete(deleteExpense); // Handles DELETE /api/expenses/:id

module.exports = router;
