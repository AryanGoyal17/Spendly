const User = require('../models/User');

const getMe = async (req, res) => {
  try {
    // req.user.id is securely provided by our protect middleware
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { monthlyBudget } = req.body;
    
    // Simple validation
    if (monthlyBudget === undefined) {
      return res.status(400).json({ message: 'Please provide a monthly budget' });
    }

    // Using returnDocument: 'after' just like we learned in Phase 3!
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { monthlyBudget },
      { returnDocument: 'after' } 
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, updateBudget };
