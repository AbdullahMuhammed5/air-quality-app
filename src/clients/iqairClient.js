const axios = require('axios');
const config = require('../config');

exports.fetchDataForNearestCity = async function (lat, long) {
	try {
		const response = await axios.get(`${config.iqairBaseUrl}/v2/nearest_city`, {
			params: {
				lat,
				long,
				key: config.iqairApiKey
			},
		});

		return response.data.data;
	} catch (error) {
		throw Error('Error fetching air quality data: ' + error.message);
	}
}
