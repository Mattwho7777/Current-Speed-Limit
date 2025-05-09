const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

// Replace this with your HERE API key or use an environment variable
const API_KEY = process.env.HERE_API_KEY || 'LjUsAIebiyhgd6_tVC7tSHL9nQseBm-b_XUFkfvjBD8';

app.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon query parameters' });
  }

  const url = `https://fleet.ls.hereapi.com/2/attributes.json?apiKey=${API_KEY}&waypoint=${lat},${lon}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const speedLimit =
      data.attributes &&
      data.attributes[0] &&
      data.attributes[0].speedLimit &&
      data.attributes[0].speedLimit.speedLimit;

    if (speedLimit !== undefined) {
      res.json({ speed_limit: speedLimit });
    } else {
      res.status(404).json({ error: 'Speed limit not found in API response' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch speed limit from HERE API' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
