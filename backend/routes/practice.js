import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { supabaseAdmin } from '../config/database.js';
import { z } from 'zod';

const router = express.Router();

const practiceSessionSchema = z.object({
  chapterId: z.string(),
  exerciseType: z.string(),
  score: z.number().min(0).max(100),
  timeSpent: z.number().min(0), // in seconds
  attempts: z.number().int().min(1),
  correctAnswers: z.number().int().min(0),
  totalQuestions: z.number().int().min(1)
});

/**
 * Save practice session
 */
router.post('/sessions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const validatedData = practiceSessionSchema.parse(req.body);

    const { data: session, error } = await supabaseAdmin
      .from('practice_sessions')
      .insert({
        user_id: userId,
        chapter_id: validatedData.chapterId,
        exercise_type: validatedData.exerciseType,
        score: validatedData.score,
        time_spent: validatedData.timeSpent,
        attempts: validatedData.attempts,
        correct_answers: validatedData.correctAnswers,
        total_questions: validatedData.totalQuestions,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving practice session:', error);
      return res.status(500).json({ error: 'Failed to save practice session' });
    }

    res.status(201).json({ session });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Practice session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get practice history for a chapter
 */
router.get('/history/:chapterId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { chapterId } = req.params;

    const { data: sessions, error } = await supabaseAdmin
      .from('practice_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .order('completed_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching practice history:', error);
      return res.status(500).json({ error: 'Failed to fetch practice history' });
    }

    res.json({ sessions: sessions || [] });
  } catch (error) {
    console.error('Practice history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get performance statistics for a chapter
 */
router.get('/stats/:chapterId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { chapterId } = req.params;

    const { data: sessions, error } = await supabaseAdmin
      .from('practice_sessions')
      .select('score, time_spent, exercise_type, completed_at')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId);

    if (error) {
      console.error('Error fetching stats:', error);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    if (!sessions || sessions.length === 0) {
      return res.json({
        averageScore: 0,
        totalTimeSpent: 0,
        totalSessions: 0,
        exerciseTypes: {},
        lastPracticeDate: null
      });
    }

    // Calculate statistics
    const averageScore = sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length;
    const totalTimeSpent = sessions.reduce((sum, s) => sum + (s.time_spent || 0), 0);
    const exerciseTypes = {};
    
    sessions.forEach(s => {
      if (!exerciseTypes[s.exercise_type]) {
        exerciseTypes[s.exercise_type] = { count: 0, avgScore: 0, totalScore: 0 };
      }
      exerciseTypes[s.exercise_type].count++;
      exerciseTypes[s.exercise_type].totalScore += s.score;
    });

    Object.keys(exerciseTypes).forEach(type => {
      exerciseTypes[type].avgScore = exerciseTypes[type].totalScore / exerciseTypes[type].count;
    });

    const lastPracticeDate = sessions
      .map(s => s.completed_at)
      .sort()
      .reverse()[0];

    res.json({
      averageScore: Math.round(averageScore * 10) / 10,
      totalTimeSpent,
      totalSessions: sessions.length,
      exerciseTypes,
      lastPracticeDate
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

