import cron from 'node-cron';
import { supabaseAdmin } from '../config/database.js';

/**
 * Check if assessment is due for a user
 * Assessments should be done 1-2 times per week
 */
export async function isAssessmentDue(userId) {
  try {
    // Get last assessment
    const { data: lastAssessment, error } = await supabaseAdmin
      .from('assessment_sessions')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking last assessment:', error);
      return false;
    }

    if (!lastAssessment) {
      // No previous assessment, suggest one
      return true;
    }

    const lastDate = new Date(lastAssessment.completed_at);
    const now = new Date();
    const daysSince = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    // Suggest assessment if 3-4 days have passed
    return daysSince >= 3;
  } catch (error) {
    console.error('Error in isAssessmentDue:', error);
    return false;
  }
}

/**
 * Get all users who need assessment reminders
 */
export async function getUsersNeedingAssessmentReminder() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, subscription_status')
      .eq('subscription_status', 'active');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    const usersNeedingReminder = [];

    for (const user of users) {
      const isDue = await isAssessmentDue(user.id);
      if (isDue) {
        usersNeedingReminder.push(user);
      }
    }

    return usersNeedingReminder;
  } catch (error) {
    console.error('Error in getUsersNeedingAssessmentReminder:', error);
    return [];
  }
}

/**
 * Get pending parent reports (assessments completed but not yet sent)
 */
export async function getPendingParentReports() {
  try {
    const { data: assessments, error } = await supabaseAdmin
      .from('assessment_sessions')
      .select(`
        id,
        user_id,
        completed_at,
        overall_score,
        users!inner(
          id,
          email,
          parent_email,
          parent_notification_enabled
        )
      `)
      .eq('status', 'completed')
      .eq('users.parent_notification_enabled', true)
      .is('parent_notification_sent_at', null)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending reports:', error);
      return [];
    }

    return assessments || [];
  } catch (error) {
    console.error('Error in getPendingParentReports:', error);
    return [];
  }
}

/**
 * Setup cron jobs
 */
export function setupScheduler() {
  // Check for assessment reminders twice daily (9 AM and 6 PM)
  cron.schedule('0 9,18 * * *', async () => {
    console.log('Running assessment reminder check...');
    try {
      const users = await getUsersNeedingAssessmentReminder();
      console.log(`Found ${users.length} users needing assessment reminders`);
      
      // In a real implementation, you would send push notifications or emails here
      // For now, we'll just log it
      // TODO: Implement notification sending
    } catch (error) {
      console.error('Error in assessment reminder cron:', error);
    }
  });

  // Send parent reports daily at 8 PM
  cron.schedule('0 20 * * *', async () => {
    console.log('Running parent report sender...');
    try {
      const pendingReports = await getPendingParentReports();
      console.log(`Found ${pendingReports.length} pending parent reports`);
      
      // In a real implementation, you would send emails here
      // This will be handled by the assessment completion endpoint
      // TODO: Implement batch email sending if needed
    } catch (error) {
      console.error('Error in parent report cron:', error);
    }
  });

  console.log('Scheduler initialized');
}

