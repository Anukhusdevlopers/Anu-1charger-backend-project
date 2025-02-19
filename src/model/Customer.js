const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true }, // Optional, but unique
  phone: { type: String, unique: true, sparse: true }, // Optional, but unique
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Customer", customerSchema);
