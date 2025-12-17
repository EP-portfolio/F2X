import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const VISION_MODEL = process.env.GEMINI_VISION_MODEL || 'gemini-1.5-pro';

if (!GEMINI_API_KEY) {
  console.warn('[VISION] GEMINI_API_KEY is not set. Vision proxy will fail until configured.');
}

export async function analyzeVisionImage(imageBase64, prompt, language = 'fr') {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not set');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: VISION_MODEL });

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64
      }
    }
  ]);

  const response = await result.response;
  const text = response.text();
  return text || (language === 'fr' ? "Analyse impossible." : "Analysis failed.");
}

