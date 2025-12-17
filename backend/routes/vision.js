import express from 'express';
import { analyzeVisionImage } from '../services/vision.js';

const router = express.Router();

// POST /api/vision/analyze
// Body: { imageBase64: string, prompt: string, language?: 'fr' | 'en' }
router.post('/analyze', async (req, res) => {
  try {
    const { imageBase64, prompt, language = 'fr' } = req.body;
    if (!imageBase64 || !prompt) {
      return res.status(400).json({ error: 'imageBase64 and prompt are required' });
    }
    // Quelques logs de debug (sans loguer l'image entière)
    console.log('[VISION] analyze call', {
      lang: language,
      imgSize: imageBase64.length,
      promptSize: prompt.length
    });
    const reply = await analyzeVisionImage(imageBase64, prompt, language);
    res.json({ reply });
  } catch (error) {
    console.error('Vision analyze error:', error);
    res.status(500).json({ error: error.message || 'Vision analysis failed' });
  }
});

export default router;

