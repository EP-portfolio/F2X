import express from 'express';
import { generateBrevetExercise, generateBrevetAnswer } from '../services/gemini.js';

const router = express.Router();

/**
 * Generate new exercise inspired by Brevet examples
 * POST /api/exercises/generate-brevet
 * Body: { rawData: number[], mean: number, median: number, language: 'fr' | 'en' }
 */
router.post('/generate-brevet', async (req, res) => {
  try {
    const { rawData, mean, median, language = 'fr' } = req.body;

    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return res.status(400).json({ error: 'rawData must be a non-empty array' });
    }

    if (typeof mean !== 'number' || typeof median !== 'number') {
      return res.status(400).json({ error: 'mean and median must be numbers' });
    }

    const exerciseProblem = await generateBrevetExercise(rawData, mean, median, language);
    
    res.json({ problem: exerciseProblem });
  } catch (error) {
    console.error('Exercise generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate exercise' });
  }
});

/**
 * Generate answer logic for Brevet exercise
 * POST /api/exercises/generate-answer
 * Body: { exerciseProblem: string, rawData: number[], mean: number, median: number, language: 'fr' | 'en' }
 */
router.post('/generate-answer', async (req, res) => {
  try {
    const { exerciseProblem, rawData, mean, median, language = 'fr' } = req.body;

    if (!exerciseProblem || typeof exerciseProblem !== 'string') {
      return res.status(400).json({ error: 'exerciseProblem must be a string' });
    }

    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return res.status(400).json({ error: 'rawData must be a non-empty array' });
    }

    if (typeof mean !== 'number' || typeof median !== 'number') {
      return res.status(400).json({ error: 'mean and median must be numbers' });
    }

    const answerLogic = await generateBrevetAnswer(exerciseProblem, rawData, mean, median, language);
    
    res.json({ answerLogic });
  } catch (error) {
    console.error('Answer generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate answer' });
  }
});

export default router;

