const Expense = require('../models/Expense');

// @desc    Get logged in user expenses (with optional filters)
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    
    // Base query: find expenses for the currently logged-in user only
    let query = { userId: req.user.id };

    // Apply optional filters if they are provided in the URL query string
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Fetch from database, sorting by date (newest first)
    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new expense
// @route   POST /api/expenses
const addExpense = async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Please provide amount, category, and date' });
    }

    const expense = await Expense.create({
      userId: req.user.id, // Automatically attach the logged-in user's ID
      amount,
      category,
      note,
      date
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Security check: Ensure the logged-in user owns this specific expense
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this expense' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Returns the newly updated document instead of the old one
    );

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Security check: Ensure the logged-in user owns this specific expense
    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };
