const express = require('express');
const cityRouter = require('./routes/cityRouter');
const cron = require('node-cron');
const { fetchAndStoreAirQualityForParisCity } = require('./services/cityService');

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/cities', cityRouter);

app.all('*', (req, res, next) => {
    return res.status(400).json({ error: 'Route not found!' });
});

// Schedule the job to run every minute
cron.schedule('* * * * *', () => {
    fetchAndStoreAirQualityForParisCity();
    console.log('Cron job executed.');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
  
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: 'Unauthorized. Check your API key.' });
    }
  
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
