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
     const translated = await translationService.translateContent({
       question,
       answer
     }, lang);
     translations.set(lang, translated);
   }
   
   faq.translations = translations;
   await faq.save();
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

exports.getFaqById = async (req, res) => {
 try {
   const faq = await FAQ.findById(req.params.id);
   if (!faq) {
     return res.status(404).json({ error: 'FAQ not found' });
   }
   const lang = req.query.lang || 'en';
   res.json({
     id: faq._id,
     ...faq.getTranslation(lang)
   });
 } catch (error) {
   res.status(500).json({ error: error.message }); 
 }
};

exports.updateFaq = async (req, res) => {
 try {
   const { question, answer } = req.body;
   const faq = await FAQ.findById(req.params.id);
   
   if (!faq) {
     return res.status(404).json({ error: 'FAQ not found' });
   }

   faq.question = question;
   faq.answer = answer;

   // Update translations
   const supportedLangs = ['hi', 'bn'];
   const translations = new Map();
   
   for (const lang of supportedLangs) {
     const translated = await translationService.translateContent({
       question,
       answer
     }, lang);
     translations.set(lang, translated);
   }

   faq.translations = translations;
   await faq.save();
   await redis.del('faqs');

   res.json(faq);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};

exports.deleteFaq = async (req, res) => {
 try {
   const faq = await FAQ.findByIdAndDelete(req.params.id);
   if (!faq) {
     return res.status(404).json({ error: 'FAQ not found' });
   }
   await redis.del('faqs');
   res.json({ message: 'FAQ deleted successfully' });
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};