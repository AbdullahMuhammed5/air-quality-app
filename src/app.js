const express = require('express');
const cityRouter = require('./routes/cityRouter');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/v1/cities', cityRouter);

app.all('*', (req, res, next) => {
    return res.status(400).json({ error: 'Route not found!' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
  
    if (err.response && err.response.status === 401) {
      return res.status(401).json({ error: 'Unauthorized. Check your API key.' });
    }
  
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});