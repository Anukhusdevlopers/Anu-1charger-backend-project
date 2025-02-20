const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password

  // Current location (optional)
  current_location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },

  // Aadhaar Images (Front & Back)
  adhar_pic_front: { type: String, },
  adhar_pic_back: { type: String, },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
partnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Partner", partnerSchema);
