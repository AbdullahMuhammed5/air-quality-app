const app = require('../../src/app');
const client = require('../../src/clients/iqairClient');
const request = require('supertest')(app);
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const AirPollution = require('../../src/models/airPollution');

describe('Test nearest-city-pollution API Endpoint', () => {

  const endPoint = "/api/v1/cities/nearest-city-pollution"

  it('should return 400 if latitude and longitude are missing', async () => {
    const res = await request.get(endPoint).query({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Both longitude and latitude are required as query parameters.' });
  });

  it('should return air quality data for valid coordinates', async () => {
    jest.spyOn(client, 'fetchDataForNearestCity').mockResolvedValue();

    const res = await request.get(endPoint).query({ lat: 123.456, lon: 45.678 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('Result');

    client.fetchDataForNearestCity.mockRestore();
  });

});

describe('Test /most-polluted-datetime API Endpoint', () => {
  const endPoint = "/api/v1/cities/most-polluted-datetime"
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
  
    // Connect to the in-memory database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create sample pollution data
    await AirPollution.insertMany(
      {
        city: 'Paris',
        aqicn: 42,
        aqius: 35,
        maincn: 'pm2.5',
        mainus: 'pm2.5',
        timestamp: "2023-09-16T18:00:00.000Z",
      },
      {
        city: 'London',
        aqicn: 56,
        aqius: 43,
        maincn: 'pm2.5',
        mainus: 'pm2.5',
        timestamp: "2023-09-16T18:00:00.000Z",
      },
    )
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should return the most polluted datetime for a city based on the specified standard (US)', async () => {
    const response = await request
      .get(endPoint)
      .query({ standard: 'US', city: 'Paris' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Result');
  });

  it('should return the most polluted datetime for a city based on the specified standard (CN)', async () => {
    const response = await request
      .get(endPoint)
      .query({ standard: 'CN', city: 'Paris' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Result');
  });

  it('should return the most polluted datetime for a city based on (US) standard as default', async () => {
    const response = await request
      .get(endPoint)
      .query({ city: 'Paris' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Result');
  });

  it('should handle the case when no pollution data is found for a city', async () => {
    const response = await request
      .get(endPoint)
      .query({ standard: 'US', city: 'UnknownCity' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ Result: 'No pollution data found for UnknownCity' });
  });

});