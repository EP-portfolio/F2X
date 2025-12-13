import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { supabaseAdmin } from '../config/database.js';
import { analyzeStudentWork, generateRecommendations } from '../services/gemini.js';
import { sendParentReport } from '../services/email.js';
import { z } from 'zod';

const router = express.Router();

const assessmentSchema = z.object({
  chapterId: z.string(),
  exercises: z.array(z.object({
    exerciseType: z.string(),
    problemData: z.any(),
    studentAnswer: z.any().optional()
  }))
});

/**
 * Create new assessment session
 */
router.post('/sessions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { chapterId } = req.body;

    const { data: session, error } = await supabaseAdmin
      .from('assessment_sessions')
      .insert({
        user_id: userId,
        chapter_id: chapterId,
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment session:', error);
      return res.status(500).json({ error: 'Failed to create assessment session' });
    }

    res.status(201).json({ session });
  } catch (error) {
    console.error('Assessment creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Analyze student work (image upload)
 */
router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId, exerciseIndex, imageBase64, exerciseData, language } = req.body;

    if (!imageBase64 || !exerciseData) {
      return res.status(400).json({ error: 'Image and exercise data required' });
    }

    // Analyze image with Gemini Vision
    const feedback = await analyzeStudentWork(imageBase64, exerciseData, language || 'fr');

    // Save exercise result
    const { error: saveError } = await supabaseAdmin
      .from('assessment_exercises')
      .insert({
        assessment_session_id: sessionId,
        exercise_type: exerciseData.type,
        problem_data: exerciseData,
        student_answer: { image: true },
        feedback: feedback,
        corrected_at: new Date().toISOString()
      });

    if (saveError) {
      console.error('Error saving exercise:', saveError);
    }

    res.json({ feedback });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze work' });
  }
});

/**
 * Complete assessment session
 */
router.post('/sessions/:sessionId/complete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;
    const { overallScore, strengths, weaknesses, exercises, language } = req.body;

    // Get session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('assessment_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Assessment session not found' });
    }

    // Get performance history for recommendations
    const { data: practiceSessions } = await supabaseAdmin
      .from('practice_sessions')
      .select('score, time_spent, chapter_id')
      .eq('user_id', userId)
      .eq('chapter_id', session.chapter_id);

    const performanceHistory = {
      averageScore: practiceSessions && practiceSessions.length > 0
        ? practiceSessions.reduce((sum, s) => sum + s.score, 0) / practiceSessions.length
        : 0,
      totalTimeSpent: practiceSessions
        ? practiceSessions.reduce((sum, s) => sum + (s.time_spent || 0), 0)
        : 0,
      masteredChapters: [] // TODO: Calculate based on scores
    };

    // Generate recommendations
    let recommendations = null;
    try {
      const recommendationsData = await generateRecommendations(
        { overallScore, strengths, weaknesses, exercises },
        performanceHistory,
        language || 'fr'
      );
      recommendations = recommendationsData.recommendations || [];
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Continue without recommendations
    }

    // Update session
    const { data: updatedSession, error: updateError } = await supabaseAdmin
      .from('assessment_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        overall_score: overallScore,
        exercises_data: exercises,
        feedback_data: { strengths, weaknesses },
        recommendations: recommendations
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating session:', updateError);
      return res.status(500).json({ error: 'Failed to complete assessment' });
    }

    // Get user info for parent email
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email, parent_email, parent_notification_enabled')
      .eq('id', userId)
      .single();

    // Send parent report if enabled
    if (user?.parent_notification_enabled && user?.parent_email) {
      try {
        await sendParentReport(
          user.parent_email,
          user.email.split('@')[0], // Use email prefix as name
          {
            overallScore,
            strengths,
            weaknesses,
            recommendations,
            completedAt: updatedSession.completed_at
          },
          language || 'fr'
        );

        // Mark as sent
        await supabaseAdmin
          .from('assessment_sessions')
          .update({ parent_notification_sent_at: new Date().toISOString() })
          .eq('id', sessionId);
      } catch (emailError) {
        console.error('Error sending parent email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({
      session: updatedSession,
      recommendations
    });
  } catch (error) {
    console.error('Complete assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get assessment history
 */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { chapterId } = req.query;

    let query = supabaseAdmin
      .from('assessment_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(20);

    if (chapterId) {
      query = query.eq('chapter_id', chapterId);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching assessment history:', error);
      return res.status(500).json({ error: 'Failed to fetch assessment history' });
    }

    res.json({ sessions: sessions || [] });
  } catch (error) {
    console.error('Assessment history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Check if assessment is due
 */
router.get('/due', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get last assessment
    const { data: lastAssessment } = await supabaseAdmin
      .from('assessment_sessions')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (!lastAssessment) {
      return res.json({ isDue: true, daysSinceLast: null });
    }

    const lastDate = new Date(lastAssessment.completed_at);
    const now = new Date();
    const daysSince = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    res.json({
      isDue: daysSince >= 3,
      daysSinceLast: daysSince,
      lastAssessmentDate: lastAssessment.completed_at
    });
  } catch (error) {
    console.error('Check due error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

