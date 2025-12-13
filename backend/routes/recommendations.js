import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { supabaseAdmin } from '../config/database.js';

const router = express.Router();

/**
 * Get recommendations for user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get latest assessment with recommendations
    const { data: latestAssessment, error } = await supabaseAdmin
      .from('assessment_sessions')
      .select('recommendations, completed_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .not('recommendations', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching recommendations:', error);
      return res.status(500).json({ error: 'Failed to fetch recommendations' });
    }

    if (!latestAssessment || !latestAssessment.recommendations) {
      return res.json({ recommendations: [] });
    }

    res.json({
      recommendations: latestAssessment.recommendations,
      generatedAt: latestAssessment.completed_at
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Mark recommendation as viewed
 */
router.post('/:recommendationId/view', authenticateToken, async (req, res) => {
  try {
    // This would update a recommendations table if we had one
    // For now, we'll just return success
    res.json({ success: true });
  } catch (error) {
    console.error('Mark viewed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

