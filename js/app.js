import { appState } from './utils/state.js';
import { authAPI } from './services/api.js';
import { renderLanguageSelector } from './components/LanguageSelector.js';
import { renderAuth, initAuth } from './components/Auth.js';
import { renderNavBar } from './components/NavBar.js';
import { renderHome } from './components/Home.js';
import { renderDashboard, resetDashboard } from './components/Dashboard.js';
import { renderLesson } from './components/Lesson.js';
import { renderPractice } from './components/Practice.js';
import { renderAiTutor, initTutor } from './components/AiTutor.js';
import { renderAssessment, initAssessment } from './components/Assessment.js';
import { renderExerciseGenerator, initExerciseGenerator } from './components/ExerciseGenerator.js';

// Global functions for onclick handlers
window.selectLanguage = (lang) => {
    appState.setState({ language: lang });
    initTutor(lang);
    initAssessment(lang);
    render();
};

window.navigateTo = (view) => {
    appState.setState({ currentView: view });
    render();
};

function render() {
    const state = appState.getState();
    const root = document.getElementById('root');

    // Check authentication
    const isAuthenticated = authAPI.isAuthenticated() && state.isAuthenticated;

    if (!isAuthenticated) {
        root.innerHTML = renderAuth(state.language || 'fr');
        lucide.createIcons();
        return;
    }

    if (!state.language) {
        root.innerHTML = renderLanguageSelector();
        lucide.createIcons();
        return;
    }

    let content = '';
    switch (state.currentView) {
        case 'DASHBOARD':
            content = renderDashboard(state.language);
            break;
        case 'EXERCISE_GENERATOR':
            content = renderExerciseGenerator(state.language);
            break;
        case 'LESSON':
            content = renderLesson(state.language);
            break;
        case 'PRACTICE':
            content = renderPractice(state.language);
            break;
        case 'ASSESSMENT':
            content = renderAssessment(state.language);
            break;
        case 'TUTOR':
            content = renderAiTutor(state.language);
            break;
        case 'HOME':
        default:
            content = renderHome(state.language);
            break;
    }

    root.innerHTML = `
    <div class="min-h-screen flex flex-col font-sans text-gray-800">
      ${renderNavBar(state.currentView, state.language)}
      <main class="flex-grow">
        ${content}
      </main>
      <footer class="py-8 text-center text-gray-400 text-sm font-medium">
        <p>&copy; 2024 Stat'Master</p>
      </footer>
    </div>
  `;

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Render chart for Practice component if needed
    if (state.currentView === 'PRACTICE' && typeof window !== 'undefined') {
        setTimeout(() => {
            const chartContainer = document.getElementById('practice-chart');
            if (chartContainer) {
                // Chart will be rendered by Practice component
                const event = new Event('practice-render');
                window.dispatchEvent(event);
            }
        }, 100);
    }
}

// Make appState and render globally accessible
window.appState = appState;
window.render = render;

// Subscribe to state changes
appState.subscribe(() => render());

// Initialize auth
initAuth();

// Initialize exercise generator
initExerciseGenerator('fr');

// Initial render
render();

