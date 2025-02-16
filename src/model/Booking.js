const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },

  customer: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },

  station: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    url: { type: String, required: true }
  },

  connectorType: { type: String, enum: ["Type1", "Type2", "CCS", "CHAdeMO"], required: true },

  startTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // Charging duration in hours
  amount: { type: Number, required: true },

  status: { type: String, enum: ["Pending", "Completed","InProgress", "Cancelled"], default: "Pending" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
