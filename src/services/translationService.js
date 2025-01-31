// src/services/translationService.js
const { Translate } = require('@google-cloud/translate').v2;

class TranslationService {
  constructor() {
    this.translate = new Translate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
    });
  }

  async translateContent({ question, answer }, targetLang) {
    try {
      const [translatedQuestion] = await this.translate.translate(question, targetLang);
      const [translatedAnswer] = await this.translate.translate(answer, targetLang);

      return {
        question: translatedQuestion,
        answer: translatedAnswer
      };
    } catch (error) {
      console.error(`Translation error for ${targetLang}:`, error);
      return { question, answer };
    }
  }
}

module.exports = new TranslationService();