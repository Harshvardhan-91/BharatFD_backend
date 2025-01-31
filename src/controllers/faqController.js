const FAQ = require('../models/Faq');
const translationService = require('../services/translationService');
const redis = require('../config/redis');

exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = new FAQ({ question, answer });
    
    // Auto-translate to supported languages
    const supportedLangs = ['hi', 'bn'];
    const translations = new Map();
    
    for (const lang of supportedLangs) {
      const translatedQuestion = await translationService.translateText(question, lang);
      const translatedAnswer = await translationService.translateText(answer, lang);
      translations.set(lang, {
        question: translatedQuestion,
        answer: translatedAnswer
      });
    }
    
    faq.translations = translations;
    await faq.save();
    
    // Clear cache
    await redis.del('faqs');
    
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const cacheKey = `faqs:${lang}`;
    
    // Check cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    const faqs = await FAQ.find();
    const translatedFaqs = faqs.map(faq => ({
      id: faq._id,
      ...faq.getTranslation(lang)
    }));
    
    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(translatedFaqs));
    
    res.json(translatedFaqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};