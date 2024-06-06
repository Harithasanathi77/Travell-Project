// redisClient.js
const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});

redisClient.connect({host:"127.0.0.1", port:6379});

module.exports = redisClient;
