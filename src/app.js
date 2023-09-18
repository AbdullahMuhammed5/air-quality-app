const express = require('express');
const cityRouter = require('./routes/cityRouter');
const config = require('../config');

require('./cronJob');

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/cities', cityRouter);

app.all('*', (req, res, next) => {
    return res.status(400).json({ error: 'Route not found!' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    if(config.nodeEnv == 'development') {
        console.error(err.stack);
    }

    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
