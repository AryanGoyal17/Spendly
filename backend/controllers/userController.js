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

module.exports = { getMe };
