const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password

  // Geospatial location
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },

  status: { type: String, enum: ["Available", "Busy"], default: "Available" },

  // Aadhaar Images (Front & Back)
  adhar_pic_front: { type: String },
  adhar_pic_back: { type: String },

  createdAt: { type: Date, default: Date.now }
});

// Create 2dsphere index for geospatial queries
partnerSchema.index({ location: "2dsphere" });

// Hash password before saving
partnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Partner", partnerSchema);
