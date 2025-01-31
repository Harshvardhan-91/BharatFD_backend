const redis = require('../config/redis');

const cacheMiddleware = async (req, res, next) => {
  try {
    const lang = req.query.lang || 'en';
    const cacheKey = `faqs:${lang}`;
    
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = cacheMiddleware;
