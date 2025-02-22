const Booking = require("../model/Booking");
const Customer = require("../model/Customer");

exports.createBooking = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // ✅ Debugging log

    const { customerId, charging_hour, amount, connectorType, ev_station_name, ev_address, ev_station_url } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "customerId is required" });
    }

    // Fetch full customer details
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Create booking data (Now storing full customer & station details)
    const bookingData = {
      customerId,
      customer: {
        _id: customer._id,
   
        email: customer.email,
        phone: customer.phone
      },
      station: {
        name: ev_station_name,
        address: ev_address,
        url: ev_station_url
      },
      connectorType,
      startTime: new Date(),
      duration: charging_hour,
      amount,
      status: "Pending"
    };

    // Save to database
    const newBooking = new Booking(bookingData);
    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.stopCharging = async (req, res) => {
  try {
    const { customerId } = req.params; // Get customerId from URL params

    // Find the latest active booking for the customer
    const booking = await Booking.findOne({ customerId, status: "Pending" }).sort({ startTime: -1 });

    if (!booking) {
      return res.status(404).json({ message: "No active charging session found for this customer" });
    }

    // Fetch full customer details
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update booking status to 'Completed'
    booking.status = "Completed";
    await booking.save();

    // Send response with full booking details
    res.status(200).json({
      message: `Charging session for customer ${customerId} has been successfully stopped`,
      booking: {
        _id: booking._id,
        startTime: booking.startTime,
        duration: booking.duration,
        amount: booking.amount,
        status: booking.status,
        connectorType: booking.connectorType,
        customer: {
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        }
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInProgressBookings = async (req, res) => {
  try {
    // Find all bookings where status is "Pending" (charging in progress)
    const bookings = await Booking.find({ status: "Pending" });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No active charging sessions found" });
    }

    // Format the response correctly
    const response = bookings.map((booking) => ({
      customer: {
        _id: booking.customer._id,
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone
      },
      station: {
        name: booking.station.name,
        address: booking.station.address,
        url: booking.station.url
      },
      connectorType: booking.connectorType,
      startTime: booking.startTime,
      duration: booking.duration,
      amount: booking.amount,
      status: booking.status
    }));

    res.status(200).json({
      message: "Active charging sessions found",
      bookings: response
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompletedBookings = async (req, res) => {
  try {
    // Find all bookings where status is "Completed"
    const bookings = await Booking.find({ status: "Completed" });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No completed charging sessions found" });
    }

    // Format the response correctly
    const response = bookings.map((booking) => ({
      customer: {
        _id: booking.customer._id,
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone
      },
      station: {
        name: booking.station.name,
        address: booking.station.address,
        url: booking.station.url
      },
      connectorType: booking.connectorType,
      startTime: booking.startTime,
      duration: booking.duration,
      amount: booking.amount,
      status: booking.status,
      completedAt: booking.updatedAt // Assuming updatedAt stores the time booking was marked as completed
    }));

    res.status(200).json({
      message: "Completed charging sessions found",
      bookings: response
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getServiceListForPartner = async (req, res) => {
  try {
    // Fetch all bookings with status "Pending" or "InProgress"
    const bookings = await Booking.find({
      status: { $in: ["Pending", "InProgress"] }
    }).populate("customerId");

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings available for review" });
    }

    // Format the response
    const response = bookings.map((booking) => ({
      bookingId: booking._id,
      startTime: booking.startTime,
      duration: booking.duration,
      amount: booking.amount,
      status: booking.status,
      connectorType: booking.connectorType,
      station: {
        name: booking.station.name,
        address: booking.station.address,
        url: booking.station.url
      },
      customer: {
        _id: booking.customer._id,
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone
      }
    }));

    res.status(200).json({
      message: "Bookings retrieved successfully for review",
      bookings: response
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllCompletedBookingsForPartner = async (req, res) => {
  try {
    // Find all bookings where status is "Completed"
    const bookings = await Booking.find({ status: "Completed" }).populate("customerId");

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No completed bookings found" });
    }

    // Format the response
    const response = bookings.map((booking) => ({
      bookingId: booking._id,
      startTime: booking.startTime,
      duration: booking.duration,
      amount: booking.amount,
      status: booking.status,
      connectorType: booking.connectorType,
      station: {
        name: booking.station.name,
        address: booking.station.address,
        url: booking.station.url
      },
      customer: {
        _id: booking.customer._id,
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone
      },
      completedAt: booking.updatedAt // Assuming updatedAt stores the completion time
    }));

    res.status(200).json({
      message: "All completed bookings retrieved successfully",
      bookings: response
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//start charging by partner 

exports.startChargingByPartner = async (req, res) => {
  try {
    const { customerId } = req.body; // Get customerId from request body

    // Find the latest pending booking for the customer
    const booking = await Booking.findOne({ customerId, status: "Pending" }).sort({ startTime: -1 });

    if (!booking) {
      return res.status(404).json({ message: "No pending booking found for this customer" });
    }

    // Update booking status to 'InProgress'
    booking.status = "InProgress";
    await booking.save();

    // Send response with updated booking details
    res.status(200).json({
      message: "Charging session started successfully",
      booking: {
        _id: booking._id,
        startTime: booking.startTime,
        duration: booking.duration,
        amount: booking.amount,
        status: booking.status,
        connectorType: booking.connectorType,
        customer: {
          _id: booking.customer._id,
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone
        }
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//stop-charging-by partner

exports.stopChargingByPartner = async (req, res) => {
  try {
    const { customerId } = req.body; // Get customerId from request body

    // Find the latest in-progress booking for the customer
    const booking = await Booking.findOne({ customerId, status: "InProgress" }).sort({ startTime: -1 });

    if (!booking) {
      return res.status(404).json({ message: "No active charging session found for this customer" });
    }

    // Update booking status to 'Completed'
    booking.status = "Completed";
    await booking.save();

    // Send response with updated booking details
    res.status(200).json({
      message: "Charging session stopped successfully",
      booking: {
        _id: booking._id,
        startTime: booking.startTime,
        duration: booking.duration,
        amount: booking.amount,
        status: booking.status,
        connectorType: booking.connectorType,
        customer: {
          _id: booking.customer._id,
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone
        }
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//charging status update by partenre
exports.updateChargingStatusByPartner = async (req, res) => {
  try {
    const { customerId, percentage } = req.body;

    // Find the latest in-progress booking for the customer
    const booking = await Booking.findOne({ customerId, status: "InProgress" }).sort({ startTime: -1 });

    if (!booking) {
      return res.status(404).json({ message: "No active charging session found for this customer" });
    }

    // Update the charging percentage
    booking.chargingPercentage = percentage;
    await booking.save();

    // Send response with updated status
    res.status(200).json({
      message: "Charging status updated successfully",
      booking: {
        _id: booking._id,
        startTime: booking.startTime,
        duration: booking.duration,
        amount: booking.amount,
        status: booking.status,
        connectorType: booking.connectorType,
        chargingPercentage: booking.chargingPercentage, // ✅ New Field
        customer: {
          _id: booking.customer._id,
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone
        }
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all bookings for a customer
exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.params.customerId }).populate("stationId partnerId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "Cancelled" }, { new: true });
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
