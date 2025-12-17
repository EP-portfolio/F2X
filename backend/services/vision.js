import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Modèle vision par défaut compatible v1beta : gemini-pro-vision (largement disponible)
const VISION_MODEL = process.env.GEMINI_VISION_MODEL || 'gemini-pro-vision';

if (!GEMINI_API_KEY) {
  console.warn('[VISION] GEMINI_API_KEY is not set. Vision proxy will fail until configured.');
}

export async function analyzeVisionImage(imageBase64, prompt, language = 'fr', mimeType = 'image/jpeg') {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not set');
  }

  // Accepter data URL (data:image/jpeg;base64,...) et ne garder que le payload
  const cleanBase64 = imageBase64.startsWith('data:')
    ? imageBase64.split(',')[1] || ''
    : imageBase64;

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: VISION_MODEL });

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType,
        data: cleanBase64
      }
    }
  ]);

  const response = await result.response;
  const text = response.text();
  return text || (language === 'fr' ? "Analyse impossible." : "Analysis failed.");
}

