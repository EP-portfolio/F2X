export function renderNavBar(currentView, language) {
  const labels = {
    fr: {
      home: 'Accueil',
      lesson: 'Cours',
      practice: 'Entraînement',
      assessment: 'Évaluation',
      tutor: 'Tuteur IA'
    },
    en: {
      home: 'Home',
      lesson: 'Lessons',
      practice: 'Practice',
      assessment: 'Assessment',
      tutor: 'AI Tutor'
    }
  };

  const t = labels[language];
  const navItems = [
    { view: 'HOME', label: t.home, icon: 'home', color: 'text-violet-600', bg: 'bg-violet-50' },
    { view: 'DASHBOARD', label: language === 'fr' ? 'Tableau de bord' : 'Dashboard', icon: 'bar-chart-2', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { view: 'EXERCISE_GENERATOR', label: language === 'fr' ? 'Générateur' : 'Generator', icon: 'shuffle', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { view: 'LESSON', label: t.lesson, icon: 'book-open', color: 'text-blue-600', bg: 'bg-blue-50' },
    { view: 'PRACTICE', label: t.practice, icon: 'calculator', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { view: 'ASSESSMENT', label: t.assessment, icon: 'clipboard-list', color: 'text-amber-600', bg: 'bg-amber-50' },
    { view: 'TUTOR', label: t.tutor, icon: 'bot', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
  ];

  return `
    <nav class="sticky top-4 z-50 px-4 mb-6">
      <div class="max-w-5xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-full border border-white/50 px-6 py-3 flex justify-between items-center transition-all">
        <div class="flex-shrink-0 font-extrabold text-xl flex items-center gap-2 text-gray-800 tracking-tight cursor-pointer" onclick="window.navigateTo('HOME')">
          <div class="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transform -rotate-3">
            <span class="font-mono text-xs font-bold">F2X</span>
          </div>
          <span class="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
            Stat'Master
          </span>
        </div>

        <div class="hidden md:flex items-center gap-1">
          ${navItems.map(item => {
            const isActive = currentView === item.view;
            return `
              <button
                onclick="window.navigateTo('${item.view}')"
                class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? `${item.bg} ${item.color} shadow-sm scale-105`
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }"
              >
                <i data-lucide="${item.icon}" class="${isActive ? item.color : 'text-gray-400'}" style="width: 18px; height: 18px;"></i>
                ${item.label}
              </button>
            `;
          }).join('')}
        </div>

        <div class="md:hidden flex gap-2">
          ${navItems.slice(1).map(item => {
            const isActive = currentView === item.view;
            return `
              <button 
                onclick="window.navigateTo('${item.view}')"
                class="p-2 rounded-full ${isActive ? item.bg + ' ' + item.color : 'text-gray-400'}"
              >
                <i data-lucide="${item.icon}" style="width: 20px; height: 20px;"></i>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </nav>
  `;
}

