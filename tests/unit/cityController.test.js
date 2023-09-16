const iqairClient = require("../../src/clients/iqairClient");
const { getNearestCityPollution } = require("../../src/controllers/cityController");

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
    const latitude = 123.456;
    const longitude = 45.678;
    const req = { query: { lat: latitude, long: longitude } };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

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