const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },

  // Bank Details
  account_number: { type: String, required: true },
  bank_name: { type: String, required: true },
  ifsc_code: { type: String, required: true },

  // Aadhaar Images (Front & Back)
  adhar_pic_front: { type: String, required: true }, // Store file URL
  adhar_pic_back: { type: String, required: true },  // Store file URL

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Partner", partnerSchema);
