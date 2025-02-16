const ChargingStation = require('../model/ChargingStation');

// Create a new charging station
exports.createChargingStation = async (req, res) => {
    try {
        const chargingStation = new ChargingStation(req.body);
        await chargingStation.save();
        res.status(201).json({ message: 'Charging station created successfully', chargingStation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all charging stations
exports.getAllChargingStations = async (req, res) => {
    try {
        const chargingStations = await ChargingStation.find().populate('partnerId');
        res.status(200).json(chargingStations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single charging station by ID
exports.getChargingStationById = async (req, res) => {
    try {
        const chargingStation = await ChargingStation.findById(req.params.id).populate('partnerId');
        if (!chargingStation) {
            return res.status(404).json({ message: 'Charging station not found' });
        }
        res.status(200).json(chargingStation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a charging station
exports.updateChargingStation = async (req, res) => {
    try {
        const chargingStation = await ChargingStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!chargingStation) {
            return res.status(404).json({ message: 'Charging station not found' });
        }
        res.status(200).json({ message: 'Charging station updated successfully', chargingStation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a charging station
exports.deleteChargingStation = async (req, res) => {
    try {
        const chargingStation = await ChargingStation.findByIdAndDelete(req.params.id);
        if (!chargingStation) {
            return res.status(404).json({ message: 'Charging station not found' });
        }
        res.status(200).json({ message: 'Charging station deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
