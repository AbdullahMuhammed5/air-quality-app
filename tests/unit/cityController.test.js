const client = require("../../src/clients/iqairClient");
const { getNearestCityPollution, getCityMostPollutedDatetime } = require("../../src/controllers/cityController");
const AirPollution = require("../../src/models/airPollution");

describe('Test getNearestCityPollution', () => {
	it('should return 400 if latitude and longitude are missing', async () => {
		const req = { query: {} };
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await getNearestCityPollution(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: 'Both longitude and latitude are required as query parameters.' });
	});

	it('should return air quality data when valid latitude and longitude are provided', async () => {
		const req = {
			query: {
				lat: 48.856613,
				lon: 2.352222
			}
		};

		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		jest.mock('../../src/clients/iqairClient', () => ({
			fetchDataForNearestCity: jest.fn().mockResolvedValue(),
		}));

		await getNearestCityPollution(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
			Result: expect.objectContaining({
				Pollution: expect.objectContaining({
					ts: expect.any(String),
					aqicn: expect.any(Number),
					aqius: expect.any(Number),
					maincn: expect.any(String),
					mainus: expect.any(String)
				})
			}),
		}));
	});
});

describe('Test getCityMostPollutedDatetime', () => {
	it('should return the most polluted datetime for a city based on the specified standard (US)', async () => {
		await testGetCityMostPollutedDatetimeWithSuccess("US")
	});

	it('should return the most polluted datetime for a city based on the specified standard (CN)', async () => {
		await testGetCityMostPollutedDatetimeWithSuccess("CN")
	});

	it('should return the most polluted datetime for a city based on (US) standard as a default', async () => {
		await testGetCityMostPollutedDatetimeWithSuccess()
	});

	it('should handle the case when no pollution data is found for a city', async () => {
		const req = {
			query: {
				standard: 'US',
				city: 'UnknownCity',
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		const findOneSpy = jest.spyOn(AirPollution, 'findOne');

		findOneSpy.mockResolvedValue(null);

		await getCityMostPollutedDatetime(req, res);

		expect(findOneSpy).toHaveBeenCalledWith(
			{ city: { '$regex': /^UnknownCity$/i } },
			{}, // we don'e need projection 
			{ sort: { aqius: -1 } }
		)

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ Result: "No pollution data found for UnknownCity" });

		// Restore the original findOne implementation
		findOneSpy.mockRestore();
	});

	it('should handle server error from retrieving data', async () => {
		const req = {
			query: {
				standard: 'US',
				city: 'Paris',
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		const findOneSpy = jest.spyOn(AirPollution, 'findOne');

		findOneSpy.mockRejectedValue();

		await getCityMostPollutedDatetime(req, res);

		expect(findOneSpy).toHaveBeenCalledWith(
			{ city: { '$regex': /^Paris$/i } },
			{}, // we don'e need projection 
			{ sort: { aqius: -1 } }
		)

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving most polluted datetime" });

		// Restore the original findOne implementation
		findOneSpy.mockRestore();
	});
});

const testGetCityMostPollutedDatetimeWithSuccess = async (standard = null) => {
	const req = {
		query: {
			standard,
			city: 'Paris',
		},
	};
	const res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};

	const sortingCriteria = standard?.toLowerCase() === 'cn' ? { aqicn: -1 } : { aqius: -1 };

	const mockData = {
		city: 'Paris',
		aqius: 60,
		mainus: 'p2',
		aqicn: 37,
		maincn: 'p1',
		timestamp: '2023-09-16T21:00:00.000Z',
	};

	const findOneSpy = jest.spyOn(AirPollution, 'findOne');

	findOneSpy.mockResolvedValue(mockData);

	await getCityMostPollutedDatetime(req, res);

	expect(findOneSpy).toHaveBeenCalledWith(
		{ city: { '$regex': /^Paris$/i } },
		{}, // we don'e need projection 
		{ sort: sortingCriteria }
	)

	expect(res.status).toHaveBeenCalledWith(200);
	expect(res.json).toHaveBeenCalledWith({ Result: mockData.timestamp });

	// Restore the original findOne implementation
	findOneSpy.mockRestore();
}
