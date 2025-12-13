export function renderHome(language) {
  const t = language === 'fr' ? {
    title: "Stat'Master",
    subtitle: "Deviens un as des",
    topic: "Statistiques",
    desc: "L'app ultime pour réviser ton Brevet. Cours interactifs, exos infinis et un prof IA cool.",
    btnStart: "C'est parti !",
    cards: [
      { id: 'DASHBOARD', title: "Tableau de bord", desc: "Suis ta progression", icon: 'bar-chart-2', color: "bg-violet-50 text-violet-600 border-violet-100" },
      { id: 'EXERCISE_GENERATOR', title: "Générateur d'exercices", desc: "Tableaux & fréquences", icon: 'shuffle', color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
      { id: 'LESSON', title: "Cours", desc: "Comprends tout en 5 min", icon: 'book-open', color: "bg-blue-50 text-blue-600 border-blue-100" },
      { id: 'PRACTICE', title: "Entraînement", desc: "Exos illimités & graphiques", icon: 'calculator', color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
      { id: 'ASSESSMENT', title: "Évaluation", desc: "Scan tes devoirs par IA", icon: 'clipboard-list', color: "bg-amber-50 text-amber-600 border-amber-100" },
      { id: 'TUTOR', title: "Tuteur IA", desc: "Une question ? Je réponds", icon: 'bot', color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
    ]
  } : {
    title: "Stat'Master",
    subtitle: "Master the",
    topic: "Statistics",
    desc: "The ultimate app to ace your exams. Interactive lessons, infinite practice, and a cool AI tutor.",
    btnStart: "Let's Go!",
    cards: [
      { id: 'DASHBOARD', title: "Dashboard", desc: "Track your progress", icon: 'bar-chart-2', color: "bg-violet-50 text-violet-600 border-violet-100" },
      { id: 'EXERCISE_GENERATOR', title: "Exercise Generator", desc: "Tables & frequencies", icon: 'shuffle', color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
      { id: 'LESSON', title: "Lessons", desc: "Understand in 5 mins", icon: 'book-open', color: "bg-blue-50 text-blue-600 border-blue-100" },
      { id: 'PRACTICE', title: "Practice", desc: "Unlimited exercises", icon: 'calculator', color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
      { id: 'ASSESSMENT', title: "Assessment", desc: "AI Homework Scan", icon: 'clipboard-list', color: "bg-amber-50 text-amber-600 border-amber-100" },
      { id: 'TUTOR', title: "AI Tutor", desc: "Ask me anything", icon: 'bot', color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
    ]
  };

  return `
    <div class="max-w-5xl mx-auto p-6 space-y-16 animate-fade-in">
      <div class="text-center space-y-8 py-10">
        <div class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 mb-4 animate-bounce">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span class="text-sm font-bold text-gray-600 uppercase tracking-wide">${language === 'fr' ? 'Nouveau Programme 2024' : 'New Program 2024'}</span>
        </div>
        
        <h1 class="text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
          ${t.subtitle} <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">${t.topic}</span>
        </h1>
        <p class="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          ${t.desc}
        </p>
        
        <button 
          onclick="window.navigateTo('LESSON')"
          class="group bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:bg-black hover:scale-105 transition-all flex items-center gap-3 mx-auto"
        >
          ${t.btnStart} <i data-lucide="arrow-right" class="group-hover:translate-x-1 transition-transform" style="width: 24px; height: 24px;"></i>
        </button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${t.cards.map(card => `
          <button 
            onclick="window.navigateTo('${card.id}')"
            class="p-6 rounded-3xl text-left border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group bg-white ${card.color.replace('bg-', 'hover:border-')}"
          >
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${card.color}">
              <i data-lucide="${card.icon}" style="width: 28px; height: 28px;"></i>
            </div>
            <h3 class="text-xl font-extrabold text-gray-800 mb-2">${card.title}</h3>
            <p class="text-gray-400 font-medium text-sm leading-relaxed">${card.desc}</p>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

