const Partner = require("../model/Partner");
const bcrypt = require("bcrypt");  // ✅ bcrypt import kiya

// Register a new partner


// Register Partner
exports.registerPartner = async (req, res) => {
  try {
    const { name, mobile, email, password, current_location } = req.body;

    // Check if email or mobile is already registered
    const existingPartner = await Partner.findOne({ $or: [{ email }, { mobile }] });
    if (existingPartner) {
      return res.status(400).json({ message: "Partner already registered with this email or mobile" });
    }

    // Process location if provided, otherwise set default
    let locationData = { lat: null, lng: null };
    if (current_location && current_location.lat && current_location.lng) {
      locationData = {
        lat: parseFloat(current_location.lat),
        lng: parseFloat(current_location.lng)
      };
    }

    // Process Aadhaar images (optional)
    let adhar_pic_front = req.files["adhar_pic_front"] ? req.files["adhar_pic_front"][0].path : null;
    let adhar_pic_back = req.files["adhar_pic_back"] ? req.files["adhar_pic_back"][0].path : null;

    // Create new partner entry
    const partner = new Partner({
      name,
      mobile,
      email,
      password, // Password will be hashed automatically due to pre('save') middleware
      current_location: locationData,
      adhar_pic_front, // Optional
      adhar_pic_back   // Optional
    });

    await partner.save();
    res.status(201).json({ message: "Partner registered successfully", partner });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if partner exists
    const partner = await Partner.findOne({ email });
    if (!partner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", partner });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all partners
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve or Reject a Partner
exports.updatePartnerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const partner = await Partner.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: "Partner status updated", partner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
