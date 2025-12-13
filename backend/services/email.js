import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL || 'noreply@statmaster.app';

if (!resendApiKey) {
  console.warn('RESEND_API_KEY not set. Email functionality will be disabled.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Send assessment report to parent
 */
export async function sendParentReport(parentEmail, studentName, assessmentData, language = 'fr') {
  if (!resend) {
    console.warn('Email service not configured. Skipping email send.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { subject, html, text } = generateParentEmail(studentName, assessmentData, language);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: parentEmail,
      subject: subject,
      html: html,
      text: text
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

function generateParentEmail(studentName, assessmentData, language) {
  const { overallScore, strengths, weaknesses, recommendations, completedAt } = assessmentData;
  const date = new Date(completedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US');

  if (language === 'fr') {
    return {
      subject: `📊 Bilan d'évaluation - ${studentName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .score { font-size: 48px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
            .section { margin: 20px 0; padding: 15px; background: white; border-radius: 8px; }
            .strength { color: #10b981; }
            .weakness { color: #ef4444; }
            .recommendation { background: #fef3c7; padding: 10px; margin: 10px 0; border-left: 4px solid #f59e0b; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Stat'Master</h1>
              <p>Bilan d'évaluation</p>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Votre enfant <strong>${studentName}</strong> a complété une session d'évaluation le <strong>${date}</strong>.</p>
              
              <div class="section">
                <h2>📈 Résultats</h2>
                <div class="score">${overallScore}%</div>
                <p style="text-align: center;">Score global</p>
              </div>

              ${strengths.length > 0 ? `
              <div class="section">
                <h3 class="strength">✅ Points forts</h3>
                <ul>
                  ${strengths.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
              ` : ''}

              ${weaknesses.length > 0 ? `
              <div class="section">
                <h3 class="weakness">📚 Points à améliorer</h3>
                <ul>
                  ${weaknesses.map(w => `<li>${w}</li>`).join('')}
                </ul>
              </div>
              ` : ''}

              ${recommendations && recommendations.length > 0 ? `
              <div class="section">
                <h3>💡 Recommandations personnalisées</h3>
                ${recommendations.map(rec => `
                  <div class="recommendation">
                    <strong>${rec.title}</strong>
                    <p>${rec.description}</p>
                    <small>Temps estimé : ${rec.estimatedTime} minutes</small>
                  </div>
                `).join('')}
              </div>
              ` : ''}

              <p>Pour plus de détails, connectez-vous à l'application Stat'Master.</p>
              
              <p>Cordialement,<br>L'équipe Stat'Master</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Stat'Master - Bilan d'évaluation

Bonjour,

Votre enfant ${studentName} a complété une session d'évaluation le ${date}.

Résultats :
- Score global : ${overallScore}%

Points forts :
${strengths.map(s => `- ${s}`).join('\n')}

Points à améliorer :
${weaknesses.map(w => `- ${w}`).join('\n')}

${recommendations && recommendations.length > 0 ? `
Recommandations :
${recommendations.map(rec => `- ${rec.title}: ${rec.description}`).join('\n')}
` : ''}

Cordialement,
L'équipe Stat'Master
      `
    };
  } else {
    return {
      subject: `📊 Assessment Report - ${studentName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .score { font-size: 48px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
            .section { margin: 20px 0; padding: 15px; background: white; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Stat'Master</h1>
              <p>Assessment Report</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your child <strong>${studentName}</strong> completed an assessment session on <strong>${date}</strong>.</p>
              
              <div class="section">
                <h2>📈 Results</h2>
                <div class="score">${overallScore}%</div>
                <p style="text-align: center;">Overall Score</p>
              </div>

              <div class="section">
                <h3>✅ Strengths</h3>
                <ul>
                  ${strengths.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>

              <div class="section">
                <h3>📚 Areas for Improvement</h3>
                <ul>
                  ${weaknesses.map(w => `<li>${w}</li>`).join('')}
                </ul>
              </div>

              ${recommendations && recommendations.length > 0 ? `
              <div class="section">
                <h3>💡 Personalized Recommendations</h3>
                ${recommendations.map(rec => `
                  <div style="background: #fef3c7; padding: 10px; margin: 10px 0; border-left: 4px solid #f59e0b;">
                    <strong>${rec.title}</strong>
                    <p>${rec.description}</p>
                  </div>
                `).join('')}
              </div>
              ` : ''}

              <p>Best regards,<br>The Stat'Master Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Stat'Master - Assessment Report

Hello,

Your child ${studentName} completed an assessment session on ${date}.

Results:
- Overall Score: ${overallScore}%

Strengths:
${strengths.map(s => `- ${s}`).join('\n')}

Areas for Improvement:
${weaknesses.map(w => `- ${w}`).join('\n')}

Best regards,
The Stat'Master Team
      `
    };
  }
}

