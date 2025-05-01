const express = require('express');
const { createClient } = require('redis');
const axios = require('axios');

const serverPort = process.env.SERVER_PORT;
const serverHost = process.env.SERVER_HOST;

const serverNumber = process.env.SERVER_NUMBER;
const weatherApiUrl = process.env.WEATHER_API_URL;

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

const app = express();
const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort,
  },
});

app.set('view engine', 'pug');

app.get('/', async (req, res) => {
  const cacheKey = `server${serverNumber}:weatherData`;
  const cachedWeatherData = await redisClient.get(cacheKey);

  if (cachedWeatherData) {
    console.log('Serving weather from cache');

    const weatherData = JSON.parse(cachedWeatherData);
    const temperature = weatherData.current.temperature_2m;

    res.render('index', { serverNumber, temperature });

    return;
  }

  console.log('Serving weather from API');

  const response = await axios.get(weatherApiUrl, {
    params: {
      latitude: 30.0626,
      longitude: 31.2497,
      current: 'temperature_2m',
      timezone: 'Africa/Cairo',
    },
  });

  const weatherData = response.data;
  const temperature = weatherData.current.temperature_2m;

  await redisClient.setEx(cacheKey, 600, JSON.stringify(weatherData)); // 600 seconds = 10 minutes

  res.render('index', { serverNumber, temperature });
});

async function main() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');

    const server = app.listen(serverPort, serverHost, () => {
      console.log(`Listening at http://${serverHost}:${serverPort}`);
    });

    const shutdownHandler = async () => {
      console.log('Shutting down gracefully...');

      await redisClient.disconnect();

      server.close(() => {
        console.log('HTTP server closed');

        process.exit(0);
      });
    };

    process.on('SIGINT', shutdownHandler);
    process.on('SIGTERM', shutdownHandler);
  } catch (err) {
    console.error('Failed to start server:', err);

    process.exit(1);
  }
}

main();
