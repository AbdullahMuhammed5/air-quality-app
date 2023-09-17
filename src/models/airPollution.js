const mongoose = require('mongoose');

const AirPollutionSchema = new mongoose.Schema(
  {
    city: String,
    aqius: Number,
    mainus: String,
    aqicn: Number,
    maincn: String,
    timestamp: Date,
  }, 
  {
    timestamps: true
  }
);

const AirPollution = mongoose.model('AirPollution', AirPollutionSchema);

module.exports = AirPollution;
