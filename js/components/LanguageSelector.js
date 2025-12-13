export function renderLanguageSelector(onSelect) {
  return `
    <div class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-violet-100 to-fuchsia-100">
      <div class="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 text-center border border-white">
        <div class="inline-block p-6 bg-white rounded-full mb-8 shadow-lg shadow-violet-100">
          <i data-lucide="languages" class="text-violet-600" style="width: 48px; height: 48px;"></i>
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Bienvenue</h1>
        <p class="text-gray-500 mb-10 font-medium text-lg">Choisis ta langue / Choose your language</p>
        
        <div class="grid gap-4">
          <button 
            onclick="window.selectLanguage('fr')"
            class="group relative w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-between overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span class="flex items-center gap-4 relative z-10 text-xl">
              <span class="text-3xl">🇫🇷</span> Français
            </span>
            <i data-lucide="arrow-right" class="relative z-10 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style="width: 24px; height: 24px;"></i>
          </button>
          
          <button 
            onclick="window.selectLanguage('en')"
            class="group w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-100 hover:border-violet-200 font-bold py-5 px-8 rounded-2xl transition-all flex items-center justify-between"
          >
            <span class="flex items-center gap-4 text-xl">
              <span class="text-3xl">🇬🇧</span> English
            </span>
            <i data-lucide="arrow-right" class="text-gray-300 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" style="width: 24px; height: 24px;"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

