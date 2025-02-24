const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true }, // Optional, but unique
  phone: { type: String, unique: true, sparse: true }, // Optional, but unique
  location: { 
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  },
  createdAt: { type: Date, default: Date.now }
});

// ✅ GeoJSON indexing for location queries
customerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Customer", customerSchema);
