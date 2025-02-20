const express = require("express");
const { addUser, getAllUsers } = require("../controller/userController");
const {registerCustomer,getAllCustomers,getCustomerProfile}=require("../controller/CustomerController");
const { registerPartner, getAllPartners, updatePartnerStatus ,loginPartner} = require("../controller/PartnerController");
const { createBooking, getCustomerBookings, cancelBooking ,updateChargingStatusByPartner,stopChargingByPartner,startChargingByPartner,getAllCompletedBookingsForPartner,getServiceListForPartner,stopCharging,getInProgressBookings,getCompletedBookings} = require("../controller/BookingController");
const router = express.Router();

// Route to add a user
router.post("/add", addUser);

// Route to get all users
router.get("/all", getAllUsers);



//start customer route
router.post("/register", registerCustomer);
router.get("/all-customer", getAllCustomers);
router.get("/customer/:id", getCustomerProfile);

//start partner route



const upload = require("../multer/index");

// Define routes
router.post("/register-partner", upload.fields([
  { name: "adhar_pic_front", maxCount: 1 },
  { name: "adhar_pic_back", maxCount: 1 }
]), registerPartner);
router.post("/login-partner", loginPartner);

router.get("/all", getAllPartners);
router.patch("/status/:id", updatePartnerStatus);

//start booking ya service route




router.post("/start-charging", createBooking);
router.post("/stop-charging/:customerId", stopCharging);
router.get("/running-charging-list", getInProgressBookings);
router.get("/completed-charging-list", getCompletedBookings);
router.get("/service-list-for-partner", getServiceListForPartner);
router.get("/completed-service-list-for-partner", getAllCompletedBookingsForPartner);
router.post("/start-charging-by-partner", startChargingByPartner);
router.post("/stop-charging-by-partner", stopChargingByPartner);
router.post("/update-charging-status-by-partner", updateChargingStatusByPartner);

router.get("/customer/:customerId", getCustomerBookings);
router.patch("/cancel/:id", cancelBooking);


//charging station start
const chargingStationController = require('../controller/ChargingStationController');

router.post('/charging-stations', chargingStationController.createChargingStation);
router.get('/charging-stations', chargingStationController.getAllChargingStations);
router.get('/charging-stations/:id', chargingStationController.getChargingStationById);
router.put('/charging-stations/:id', chargingStationController.updateChargingStation);
router.delete('/charging-stations/:id', chargingStationController.deleteChargingStation);
module.exports = router;
