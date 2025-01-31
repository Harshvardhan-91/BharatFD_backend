# Multilingual FAQ System

A Node.js-based FAQ management system with multilingual support, caching, and WYSIWYG editor capabilities.

## Directory Structure
```
faq-system/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── redis.js         # Redis connection
│   ├── controllers/
│   │   └── faqController.js # FAQ CRUD operations
│   ├── models/
│   │   └── Faq.js          # FAQ MongoDB model
│   ├── routes/
│   │   └── faqRoutes.js    # API routes
│   ├── middleware/
│   │   ├── cache.js        # Redis caching
│   │   └── validator.js    # Input validation
│   ├── services/
│   │   └── translationService.js # Translation API integration
│   └── app.js              # Express app setup
├── tests/
│   └── faq.test.js        # Unit tests
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Features

- FAQ management with multilingual support
- Automated translations using Google Translate API
- Redis caching for improved performance
- RESTful API endpoints
- Docker support for easy deployment
- Comprehensive test coverage

## Prerequisites

- Node.js 16+
- MongoDB
- Redis
- Google Cloud Translate API credentials

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd faq-system
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```env
MONGODB_URI=mongodb://localhost:27017/faq_system
REDIS_URL=redis://localhost:6379
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CREDENTIALS={"your":"credentials"}
PORT=3000
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Docker Setup

```bash
docker-compose up --build
```

## API Endpoints

### Get FAQs
```bash
# Get FAQs in English (default)
GET /api/faqs

# Get FAQs in Hindi
GET /api/faqs?lang=hi

# Get FAQs in Bengali
GET /api/faqs?lang=bn
```

### Create FAQ
```bash
POST /api/faqs
Content-Type: application/json

{
  "question": "What is this FAQ about?",
  "answer": "This FAQ is about multilingual content management."
}
```

### Update FAQ
```bash
PUT /api/faqs/:id
Content-Type: application/json

{
  "question": "Updated question?",
  "answer": "Updated answer"
}
```

### Delete FAQ
```bash
DELETE /api/faqs/:id
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Cache Implementation
- Redis caches FAQ responses for 1 hour
- Automatic cache invalidation on updates
- Language-specific caching with `?lang=` parameter
- Improved response times for frequently accessed FAQs

## Technologies Used
- Node.js/Express
- MongoDB/Mongoose
- Redis
- Docker
- Google Cloud Translation API

## License

This project is licensed under the MIT License.
