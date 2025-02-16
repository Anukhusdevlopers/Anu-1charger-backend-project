const Partner = require("../model/Partner");

// Register a new partner


// Register Partner
exports.registerPartner = async (req, res) => {
  try {
    const { name, mobile, email, address, account_number, bank_name, ifsc_code } = req.body;

    // Check if email or mobile is already registered
    const existingPartner = await Partner.findOne({ $or: [{ email }, { mobile }] });
    if (existingPartner) {
      return res.status(400).json({ message: "Partner already registered with this email or mobile" });
    }

    // Ensure both Aadhaar images are uploaded
    if (!req.files["adhar_pic_front"] || !req.files["adhar_pic_back"]) {
      return res.status(400).json({ message: "Both Aadhaar images are required" });
    }

    // Create new partner entry
    const partner = new Partner({
      name,
      mobile,
      email,
      address,
      account_number,
      bank_name,
      ifsc_code,
      adhar_pic_front: req.files["adhar_pic_front"][0].path,
      adhar_pic_back: req.files["adhar_pic_back"][0].path
    });

    await partner.save();
    res.status(201).json({ message: "Partner registered successfully", partner });

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
