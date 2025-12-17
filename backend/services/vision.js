import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Modèles vision à essayer (dans l'ordre de préférence)
// Note: gemini-1.5-flash et gemini-1.5-pro supportent la vision nativement
const VISION_MODEL_ENV = process.env.GEMINI_VISION_MODEL;
const VISION_MODEL_FALLBACKS = VISION_MODEL_ENV
  ? [VISION_MODEL_ENV]
  : [
      'gemini-1.5-flash',  // Modèle le plus rapide et largement disponible
      'gemini-1.5-flash-001', // Variante avec version explicite
      'gemini-1.5-pro',     // Plus puissant
      'gemini-1.5-pro-001', // Variante avec version explicite
      'gemini-2.0-flash-exp' // Expérimental (peut ne pas être disponible)
    ];

if (!GEMINI_API_KEY) {
  console.warn('[VISION] GEMINI_API_KEY is not set. Vision proxy will fail until configured.');
}

/**
 * Liste les modèles disponibles via l'API Gemini
 */
async function listAvailableModels(genAI) {
  try {
    // Note: Le SDK ne fournit pas directement listModels, on doit utiliser l'API REST
    // Pour l'instant, on essaie simplement les modèles dans l'ordre
    return null;
  } catch (err) {
    console.warn('[VISION] Could not list models:', err);
    return null;
  }
}

async function tryVisionModel(genAI, modelName, cleanBase64, prompt, mimeType) {
  try {
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
  } catch (error) {
    // Si l'erreur indique que le modèle n'existe pas ou n'est pas supporté pour generateContent
    if (error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('not supported')) {
      throw new Error(`Model ${modelName} not available or not supported for vision`);
    }
    throw error;
  }
}

/**
 * Essaie d'utiliser l'API REST directement pour voir quels modèles sont disponibles
 */
async function tryDirectREST(modelName, cleanBase64, prompt, mimeType) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`REST API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    throw error;
  }
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

  // Essayer d'abord avec le SDK
  for (const modelName of VISION_MODEL_FALLBACKS) {
    try {
      console.log(`[VISION] trying SDK model ${modelName}`);
      const text = await tryVisionModel(genAI, modelName, cleanBase64, prompt, mimeType);
      const reply = text || (language === 'fr' ? "Analyse impossible." : "Analysis failed.");
      console.log(`[VISION] success with SDK model ${modelName}`);
      return reply;
    } catch (err) {
      console.error(`[VISION] SDK model ${modelName} failed:`, err?.message || err);
      errors.push(`SDK ${modelName}: ${err?.message || err}`);
      
      // Si le SDK échoue avec 404, essayer l'API REST directe
      if (err?.message?.includes('404') || err?.message?.includes('not found')) {
        try {
          console.log(`[VISION] trying REST API for model ${modelName}`);
          const text = await tryDirectREST(modelName, cleanBase64, prompt, mimeType);
          const reply = text || (language === 'fr' ? "Analyse impossible." : "Analysis failed.");
          console.log(`[VISION] success with REST API model ${modelName}`);
          return reply;
        } catch (restErr) {
          console.error(`[VISION] REST API model ${modelName} also failed:`, restErr?.message || restErr);
          errors.push(`REST ${modelName}: ${restErr?.message || restErr}`);
        }
      }
    }
  }

  throw new Error(`Tous les modèles vision ont échoué. Détails: ${errors.join(' | ')}`);
}

