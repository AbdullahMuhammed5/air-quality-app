const { fetchDataForNearestCity } = require('../clients/iqairClient');
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
