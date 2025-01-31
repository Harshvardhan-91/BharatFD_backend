const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

module.exports = redis;