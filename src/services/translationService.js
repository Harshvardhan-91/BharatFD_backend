const { Translate } = require('@google-cloud/translate').v2;

class TranslationService {
  constructor() {
    this.translate = new Translate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
    });
  }

  async translateText(text, targetLang) {
    try {
      const [translation] = await this.translate.translate(text, targetLang);
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }
}

module.exports = new TranslationService();