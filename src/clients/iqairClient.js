const axios = require('axios');
const config = require('../../config');
const AirPollution = require('../models/airPollution');

exports.fetchDataForNearestCity = async (lat, lon) => {
	try {
		const response = await axios.get(`${config.iqairBaseUrl}/v2/nearest_city`, {
			params: {
				lat,
				lon,
				key: config.iqairApiKey
			},
		});

		return response?.data?.data;
	} catch (error) {
		throw Error('Error fetching air quality data: ' + error.message);
	}
}

exports.fetchDataForParisCity = async () => {
	const latitude = 48.856613;
	const longitude = 2.352222;

	try {
		const response = await axios.get(`${config.iqairBaseUrl}/v2/nearest_city`, {
			params: {
				lat: latitude,
				lon: longitude,
				key: config.iqairApiKey,
			},
		});

		const { current, city } = response.data.data;

		await AirPollution.create({
			city: city,
			aqicn: current?.pollution.aqicn,
			aqius: current?.pollution.aqius,
			maincn: current?.pollution.maincn,
			mainus: current?.pollution.mainus,
			timestamp: current?.pollution.ts,
		})

	} catch (error) {
		throw error
	}
}
