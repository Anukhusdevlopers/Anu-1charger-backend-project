const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
    stationName: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        long: { type: Number, required: true }
    },
    availableSlots: { type: Number, required: true },
    powerCapacity: { type: Number, enum: [50, 100], required: true },
    pricePerHour: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChargingStation', chargingStationSchema);
