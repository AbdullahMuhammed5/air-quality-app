const app = require('../../src/app');
const request = require('supertest')(app);

describe('Test getNearestCityPollution', () => {
  const endPoint = "/api/v1/cities/nearest-city-pollution"

  it('should return 400 if latitude and longitude are missing', async () => {
    const res = await request.get(endPoint).query({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Both longitude and latitude are required as query parameters.' });
  });

  it('should return air quality data when valid latitude and longitude are provided', async () => {
    const latitude = 123.456;
    const longitude = 45.678;

    const res = await request.get(endPoint).query({ lat: latitude, long: longitude });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('Result');
  });

});
