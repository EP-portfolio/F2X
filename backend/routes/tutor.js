import express from 'express';
import { getTutorResponse } from '../services/gemini.js';
import { getTutorResponseGroq } from '../services/groq.js';

const router = express.Router();

/**
 * Chat with AI tutor
 * POST /api/tutor/chat
 * Body: { message: string, history?: { role: 'user' | 'model', text: string }[], language?: 'fr' | 'en' }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [], language = 'fr' } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();
    let reply;

    if (provider === 'groq') {
      reply = await getTutorResponseGroq(message, history, language);
    } else {
      reply = await getTutorResponse(message, history, language);
    }

    res.json({ reply });
  } catch (error) {
    console.error('Tutor chat error:', error);
    res.status(500).json({ error: error.message || 'Tutor chat failed' });
  }
});

export default router;

