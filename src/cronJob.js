const cron = require('node-cron');
const { fetchAndStoreAirQualityForParisCity } = require('./services/cityService');

cron.schedule('* * * * *', () => {
  fetchAndStoreAirQualityForParisCity();
  console.log('Cron job executed.');
});