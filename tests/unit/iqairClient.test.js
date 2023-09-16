const axios = require('axios');
const config = require('../../config');
const { fetchDataForNearestCity } = require('../../src/clients/iqairClient');

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
          long: longitude,
          key: config.iqairApiKey,
        },
      });
      expect(result).toEqual(mockData.data);
    } catch (error) {}
  });
});
