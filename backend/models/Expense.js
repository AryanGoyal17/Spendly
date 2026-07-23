const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Links this expense to the User collection
    index: true  // Adds an index on userId for faster queries
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other'] // The exact fixed options
  },
  note: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
