import { practiceAPI, assessmentAPI, recommendationsAPI } from '../services/api.js';

let dashboardState = {
  stats: null,
  recentAssessments: [],
  recommendations: [],
  isLoading: true
};

export async function renderDashboard(language) {
  const state = window.appState?.getState();
  const chapterId = 'stats-3eme'; // Default chapter for now

  // Load data
  if (dashboardState.isLoading) {
    try {
      const [stats, assessments, recommendations] = await Promise.all([
        practiceAPI.getStats(chapterId).catch(() => null),
        assessmentAPI.getHistory(chapterId).catch(() => []),
        recommendationsAPI.get().catch(() => [])
      ]);

      dashboardState.stats = stats;
      dashboardState.recentAssessments = assessments.slice(0, 5);
      dashboardState.recommendations = recommendations;
      dashboardState.isLoading = false;
    } catch (error) {
      console.error('Error loading dashboard:', error);
      dashboardState.isLoading = false;
    }
  }

  const t = language === 'fr' ? {
    title: "Tableau de bord",
    stats: "Statistiques",
    averageScore: "Score moyen",
    totalTime: "Temps total",
    sessions: "Sessions",
    recentAssessments: "Évaluations récentes",
    recommendations: "Recommandations",
    noData: "Aucune donnée pour le moment",
    startPractice: "Commencer l'entraînement",
    startAssessment: "Commencer une évaluation",
    viewAll: "Voir tout",
    lastPractice: "Dernière pratique",
    score: "Score",
    completed: "Complété le",
    priority: "Priorité",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
    estimatedTime: "Temps estimé",
    minutes: "min"
  } : {
    title: "Dashboard",
    stats: "Statistics",
    averageScore: "Average Score",
    totalTime: "Total Time",
    sessions: "Sessions",
    recentAssessments: "Recent Assessments",
    recommendations: "Recommendations",
    noData: "No data yet",
    startPractice: "Start Practice",
    startAssessment: "Start Assessment",
    viewAll: "View All",
    lastPractice: "Last Practice",
    score: "Score",
    completed: "Completed on",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    estimatedTime: "Estimated Time",
    minutes: "min"
  };

  const stats = dashboardState.stats || {
    averageScore: 0,
    totalTimeSpent: 0,
    totalSessions: 0,
    lastPracticeDate: null
  };

  const totalMinutes = Math.round(stats.totalTimeSpent / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const timeDisplay = totalHours > 0 
    ? `${totalHours}h ${remainingMinutes}min`
    : `${remainingMinutes}min`;

  return `
    <div class="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div class="mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-2">${t.title}</h2>
        <p class="text-gray-500">${language === 'fr' ? 'Suivez votre progression' : 'Track your progress'}</p>
      </div>

      ${dashboardState.isLoading ? `
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      ` : `
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="text-sm font-bold text-gray-500 uppercase mb-2">${t.averageScore}</div>
            <div class="text-4xl font-extrabold text-violet-600">${stats.averageScore.toFixed(1)}%</div>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="text-sm font-bold text-gray-500 uppercase mb-2">${t.totalTime}</div>
            <div class="text-4xl font-extrabold text-emerald-600">${timeDisplay}</div>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="text-sm font-bold text-gray-500 uppercase mb-2">${t.sessions}</div>
            <div class="text-4xl font-extrabold text-amber-600">${stats.totalSessions}</div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold text-gray-900 mb-4">${t.recentAssessments}</h3>
            ${dashboardState.recentAssessments.length > 0 ? `
              <div class="space-y-4">
                ${dashboardState.recentAssessments.map(assessment => `
                  <div class="border border-gray-200 rounded-xl p-4 hover:border-violet-300 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <div class="font-bold text-gray-900">${t.score}: ${assessment.overall_score || 0}%</div>
                        <div class="text-sm text-gray-500">${t.completed} ${new Date(assessment.completed_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="text-center py-8 text-gray-400">
                ${t.noData}
              </div>
            `}
            <button
              onclick="window.navigateTo('ASSESSMENT')"
              class="mt-4 w-full bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors"
            >
              ${t.startAssessment}
            </button>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold text-gray-900 mb-4">${t.recommendations}</h3>
            ${dashboardState.recommendations.length > 0 ? `
              <div class="space-y-4">
                ${dashboardState.recommendations.slice(0, 3).map(rec => `
                  <div class="border border-gray-200 rounded-xl p-4 hover:border-violet-300 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                      <div class="font-bold text-gray-900">${rec.title || 'Recommandation'}</div>
                      <span class="px-2 py-1 text-xs font-bold rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }">
                        ${rec.priority === 'high' ? t.high : rec.priority === 'medium' ? t.medium : t.low}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">${rec.description || ''}</p>
                    <div class="text-xs text-gray-500">
                      ${t.estimatedTime}: ${rec.estimatedTime || '15'} ${t.minutes}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="text-center py-8 text-gray-400">
                ${t.noData}
              </div>
            `}
            <button
              onclick="window.navigateTo('PRACTICE')"
              class="mt-4 w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors"
            >
              ${t.startPractice}
            </button>
          </div>
        </div>
      `}
    </div>
  `;
}

export function resetDashboard() {
  dashboardState = {
    stats: null,
    recentAssessments: [],
    recommendations: [],
    isLoading: true
  };
}

