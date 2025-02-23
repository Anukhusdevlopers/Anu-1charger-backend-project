const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },

  customer: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
 
    email: { type: String,  },
    phone: { type: String, }
  },

  station: {
    name: { type: String, },
    address: { type: String,  },
    url: { type: String,  }
  },

  connectorType: { type: String, enum: ["Connector 1", "Connector 2", "CCS"], required: true },


  

  startTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // Charging duration in hours
  amount: { type: Number, required: true },

  status: { type: String, enum: ["Pending", "Completed","InProgress", "Cancelled"], default: "Pending" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
