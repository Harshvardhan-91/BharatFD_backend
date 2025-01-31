const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const FAQ = require('../src/models/Faq');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await FAQ.deleteMany({});
});

describe('FAQ API', () => {
  describe('POST /api/faqs', () => {
    it('should create a new FAQ', async () => {
      const response = await request(app)
        .post('/api/faqs')
        .send({
          question: 'What is this test question?',
          answer: 'This is a test answer that should be valid.'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('answer');
    });

    it('should validate input', async () => {
      const response = await request(app)
        .post('/api/faqs')
        .send({
          question: '',
          answer: ''
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/faqs', () => {
    it('should get FAQs in English', async () => {
      await FAQ.create({
        question: 'Test Question?',
        answer: 'Test Answer',
        translations: new Map([
          ['hi', { question: 'प्रश्न', answer: 'उत्तर' }]
        ])
      });

      const response = await request(app).get('/api/faqs');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get FAQs in Hindi', async () => {
      await FAQ.create({
        question: 'Test Question?',
        answer: 'Test Answer',
        translations: new Map([
          ['hi', { question: 'प्रश्न', answer: 'उत्तर' }]
        ])
      });

      const response = await request(app).get('/api/faqs?lang=hi');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});