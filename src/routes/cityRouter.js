const express = require('express');
const cityController = require('../controllers/cityController');

const router = express.Router();

router.get('/nearest-city-pollution', cityController.getNearestCityPollution);

module.exports = router;
