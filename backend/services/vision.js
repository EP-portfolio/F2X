import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Modèle(s) vision compatibles v1beta : gemini-1.5-flash, gemini-1.5-pro (vision), gemini-pro-vision
// On définit une liste de fallback en cas de 404/erreur modèle.
const VISION_MODEL_ENV = process.env.GEMINI_VISION_MODEL;
const VISION_MODEL_FALLBACKS = VISION_MODEL_ENV
  ? [VISION_MODEL_ENV]
  : ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro-vision'];

if (!GEMINI_API_KEY) {
  console.warn('[VISION] GEMINI_API_KEY is not set. Vision proxy will fail until configured.');
}

async function tryVisionModel(genAI, modelName, cleanBase64, prompt, mimeType) {
  const model = genAI.getGenerativeModel({ model: modelName });
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
  return response.text();
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
  const errors = [];

  for (const modelName of VISION_MODEL_FALLBACKS) {
    try {
      console.log(`[VISION] trying model ${modelName}`);
      const text = await tryVisionModel(genAI, modelName, cleanBase64, prompt, mimeType);
      const reply = text || (language === 'fr' ? "Analyse impossible." : "Analysis failed.");
      console.log(`[VISION] success model ${modelName}`);
      return reply;
    } catch (err) {
      console.error(`[VISION] model ${modelName} failed:`, err?.message || err);
      errors.push(`${modelName}: ${err?.message || err}`);
      // continue to next model
    }
  }

  throw new Error(`Tous les modèles vision ont échoué. Détails: ${errors.join(' | ')}`);
}

