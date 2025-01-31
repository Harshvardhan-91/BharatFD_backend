const { Translate } = require('@google-cloud/translate').v2;

class TranslationService {
  constructor() {
    this.translate = new Translate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
    });
    
    this.supportedLanguages = ['en', 'hi', 'bn'];
  }

  async translateContent(content, targetLang) {
    if (targetLang === 'en') return content;
    
    try {
      const [translation] = await this.translate.translate(content, targetLang);
      return translation;
    } catch (error) {
      console.error(`Translation error for ${targetLang}:`, error);
      return content;
    }
  }

  async translateFaq(faq, targetLang) {
    try {
      const [translatedQuestion, translatedAnswer] = await Promise.all([
        this.translateContent(faq.question, targetLang),
        this.translateContent(faq.answer, targetLang)
      ]);

      return {
        question: translatedQuestion,
        answer: translatedAnswer
      };
    } catch (error) {
      console.error('FAQ translation error:', error);
      return {
        question: faq.question,
        answer: faq.answer
      };
    }
  }

  isSupportedLanguage(lang) {
    return this.supportedLanguages.includes(lang);
  }
}

module.exports = new TranslationService();