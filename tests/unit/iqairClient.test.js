const axios = require('axios');
const config = require('../../config');
const { fetchDataForNearestCity, fetchDataForParisCity } = require('../../src/clients/iqairClient');
const AirPollution = require('../../src/models/airPollution');

jest.mock('axios'); // Mock axios module

describe('Test fetchDataForNearestCity', () => {

  it('should return error when latitude and longitude are missing', async () => {
    const latitude = undefined;
    const longitude = undefined;

    try{
      await fetchDataForNearestCity(latitude, longitude);
      // If the function doesn't throw an error, fail the test
      throw new Error('Function did not throw expected error.');
    } catch (error) {
      expect(error.message).toContain('Error fetching air quality data');
    }
  });
  
  it('should handle errors when fetching air quality data', async () => {
    const errorMessage = 'Network error';

    axios.get.mockRejectedValue(new Error(errorMessage));

    const latitude = 123.456;
    const longitude = 45.678;

    try {
      await fetchDataForNearestCity(latitude, longitude);
    } catch (error) {
      expect(error.message).toContain('Error fetching air quality data');
      expect(error.message).toContain(errorMessage);
    }
  });

  it('should fetch air quality data for given latitude and longitude', async () => {
    const mockData = { data: 'sample air quality data' };

    axios.get.mockResolvedValue(mockData); // Mock the axios.get method

    const latitude = 123.456;
    const longitude = 45.678;

    try{
      const result = await fetchDataForNearestCity(latitude, longitude);
      expect(axios.get).toHaveBeenCalledWith(`${config.iqairBaseUrl}/v2/nearest_city`, {
        params: {
          lat: latitude,
          lon: longitude,
          key: config.iqairApiKey,
        },
      });
      expect(result).toEqual(mockData.data);
    } catch (error) {}
  });
});


describe('Test fetchDataForParisCity', () => {

  it('should throw an error if the API request fails', async () => {
    // Mock the Axios.get method to simulate an error
    axios.get.mockRejectedValue(new Error('Internal Server Error'));

    await expect(fetchDataForParisCity()).rejects.toThrow('Internal Server Error');
  });

  it('should store the air quality data for Paris in the database', async () => {
    const mockApiResponse = {
      data: {
        data: {
          current: {
            pollution: {
              aqicn: 42,
              aqius: 35,
              maincn: 'pm2.5',
              mainus: 'pm2.5',
              ts: "2023-09-16T18:00:00.000Z",
            },
          },
          city: 'Paris',
        },
      },
    };

    // Mock the Axios.get method to return the predefined response
    axios.get.mockResolvedValue(mockApiResponse);

    // Create a spy for AirPollution.create
    const createSpy = jest.spyOn(AirPollution, 'create');

    createSpy.mockResolvedValue();

    await fetchDataForParisCity();

    expect(createSpy).toHaveBeenCalledWith({
      city: 'Paris',
      aqicn: 42,
      aqius: 35,
      maincn: 'pm2.5',
      mainus: 'pm2.5',
      timestamp: "2023-09-16T18:00:00.000Z",
    });

    createSpy.mockRestore();
  });
});