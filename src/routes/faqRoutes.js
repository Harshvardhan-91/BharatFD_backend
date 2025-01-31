const express = require('express');
const router = express.Router();
const { createFaq, getFaqs } = require('../controllers/faqController');
const { validateFaq } = require('../middleware/validator');

router.post('/', validateFaq, createFaq);
router.get('/', getFaqs);

module.exports = router;

// src/middleware/validator.js
const { body } = require('express-validator');

exports.validateFaq = [
  body('question').notEmpty().trim(),
  body('answer').notEmpty().trim(),
];
