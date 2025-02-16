const Customer = require("../model/Customer");

// Register a new customer (NO PASSWORD)
exports.registerCustomer = async (req, res) => {
    try {
        console.log("📌 Incoming Request Body:", req.body); // Log request body
    
        const { name, email, phone } = req.body;
    
        if (!name || !email || !phone) {
          console.log("❌ Missing required fields");
          return res.status(400).json({ error: "All fields are required (name, email, phone)" });
        }
    
        const newCustomer = new Customer({ name, email, phone });
        await newCustomer.save();
    
        console.log("✅ Customer Registered Successfully:", newCustomer);
    
        res.status(201).json({ message: "Customer registered successfully", customer: newCustomer });
      } catch (error) {
        console.error("❌ Error registering customer:", error);
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
