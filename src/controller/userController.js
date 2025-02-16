const User = require("../model/User");

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ message: "✅ User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
