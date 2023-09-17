const { fetchDataForNearestCity } = require('../clients/iqairClient');
const AirPollution = require('../models/airPollution');
const { mapPollutionData } = require('../services/cityService');

exports.getNearestCityPollution = async function (req, res) {
  try {
    const { lat, long } = req.query;

    if (!lat || !long) {
      return res.status(400).json({ error: 'Both longitude and latitude are required as query parameters.' });
    }

    const airQualityData = await fetchDataForNearestCity(lat, long);
    
    return res.status(200).json(mapPollutionData(airQualityData));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// This function is generic for all cities, however we will only retreive data for Paris
// since the Cron Job only stores Paris data in our database 
// The rest of cities will get the handled error - No pollution data found
exports.getCityMostPollutedDatetime = async function (req, res) {
  try {
    const { standard, city } = req.query;

    const sortingCriteria = standard?.toLowerCase() === 'cn' ? { aqicn: -1 } : { aqius: -1 };
    const cityQuery = { city: { $regex: new RegExp(`^${city}$`, 'i') } };

    const mostPollutedRecord = await AirPollution.findOne(cityQuery, {}, { sort: sortingCriteria })

    if (!mostPollutedRecord) {
      return res.status(404).json({ Result: `No pollution data found for ${city}` });
    }

    const mostPollutedDateTime = mostPollutedRecord.timestamp;
    
    return res.status(200).json({ Result: mostPollutedDateTime });
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving most polluted datetime' });
  }
}
