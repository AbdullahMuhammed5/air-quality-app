const { fetchDataForParisCity } = require("../clients/iqairClient");

exports.fetchAndStoreAirQualityForParisCity = async () =>  {
    try{
        fetchDataForParisCity()
        console.log('Air quality data saved');
    } catch(error) {
        console.error('Error fetching or saving air quality data:', error.message);
    }
}

exports.mapPollutionData = (data) => {
    return {
      Result: {
        Pollution: data.current.pollution
      }
    };
}