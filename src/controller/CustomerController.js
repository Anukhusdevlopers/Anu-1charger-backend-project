const Customer = require("../model/Customer");

// Register a new customer (NO PASSWORD)
exports.registerCustomer = async (req, res) => {
  try {
    console.log("📌 Incoming Request Body:", req.body);

    const { email, phone } = req.body;

    // 🔹 Check if either email or phone is provided
    if (!email && !phone) {
        console.log("❌ Missing required fields");
        return res.status(400).json({ error: "Either Email or Phone is required to log in" });
    }

    // 🔹 Check if customer exists (by email OR phone)
    let existingCustomer = await Customer.findOne({
        $or: [{ email }, { phone }]
    });

    if (existingCustomer) {
        console.log("✅ Customer Found, Logging in:", existingCustomer);
        return res.status(200).json({ message: "Login successful", customer: existingCustomer });
    }

    // ✅ If not found, create a new customer
    const newCustomer = new Customer({ email, phone });
    await newCustomer.save();

    console.log("✅ New Customer Registered:", newCustomer);
    return res.status(201).json({ message: "Customer registered successfully", customer: newCustomer });

} catch (error) {
    console.error("❌ Error registering/logging in customer:", error);
    res.status(500).json({ error: error.message });
}
};

// Get customer profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
